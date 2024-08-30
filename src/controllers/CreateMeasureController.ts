import { Request, Response } from "express";
import CreateMeasureService from "../services/CreateMeasureService";

import prismaClient from "../prisma";

import fs from "fs";
import path from "path";

import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';

const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY as string);

async function uploadImageToGoogle(imagePath: string): Promise<string> {
    const uploadResult = await fileManager.uploadFile(imagePath, {
      mimeType: 'image/png',
      displayName: path.basename(imagePath),
    });
    return uploadResult.file.uri;
}

class CreateMeasureController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { image, customer_code, measure_datetime, measure_type } = request.body;

    if (!image || !customer_code || !measure_datetime || !measure_type) {
        return response.status(400).json({
          error_code: "INVALID_DATA",
          error_description: "Os dados fornecidos no corpo da requisição são inválidos",
        });
    }

    const validMeasureTypes = ["WATER", "GAS"];
      if (!validMeasureTypes.includes(measure_type.toUpperCase())) {
        return response.status(400).json({
          error_code: "INVALID_DATA",
          error_description: "O tipo de medida deve ser 'WATER' ou 'GAS'",
        });
    }

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const existingMeasure = await prismaClient.measure.findFirst({
      where: {
        customer: {
          customerCode: customer_code,
        },
        measureType: measure_type.toUpperCase(),
        measureDatetime: {
          gte: new Date(currentYear, currentMonth, 1),
          lt: new Date(currentYear, currentMonth + 1, 1), 
        },
      },
    });

    if (existingMeasure) {
      return response.status(409).json({
        error_code: "DOUBLE_REPORT",
        error_description: "Leitura do mês já realizada",
      });
    }

    const buffer = Buffer.from(image, 'base64');
    const imageFileName = `${customer_code}_${Date.now()}.png`;
    const imagePath = path.join(__dirname, "..", "uploads", imageFileName);

    if (!fs.existsSync(path.join(__dirname, "..", "uploads"))) {
      fs.mkdirSync(path.join(__dirname, "..", "uploads"));
    }

    fs.writeFileSync(imagePath, buffer);

    const imageUrl = await uploadImageToGoogle(imagePath);


    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
    });

    const uploadResponse = {
        file: {
          mimeType: "image/png",
          uri: imageUrl,
        }
      };
  

    const result = await model.generateContent([
    {
        fileData: {
        mimeType: uploadResponse.file.mimeType,
        fileUri: uploadResponse.file.uri,
        },
    },
    { text: "Extract the measured value from the water/gas meter in the image and return only the number. Do not include any additional text, just the numeric value." },
    ]);
    const measure_value_generated = parseFloat(result.response.text());

    if (isNaN(measure_value_generated)) {
        return response.status(500).json({
          error_code: "INVALID_MEASURE",
          error_description: "A medida extraída da imagem não é um valor numérico válido.",
        });
    }


    const measure = await CreateMeasureService.execute({
      image: imageUrl,
      customer_code,
      measure_datetime,
      measure_type,
      measure_value: measure_value_generated,
    });

    return response.status(200).json({
        image_url: imageUrl, 
        measure_value: measure_value_generated,
        measure_uuid: measure.measureUuid, 
    });

  }
}

export default new CreateMeasureController();