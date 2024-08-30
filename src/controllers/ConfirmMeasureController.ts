import { Request, Response } from 'express';
import CreateConfirmMeasureService from '../services/CreateConfirmMeasureService';

class ConfirmMeasureController{
    async handle(request: Request, response: Response): Promise<Response>{
        const { measure_uuid, confirmed_value } = request.body;

    try {
      const measure = await CreateConfirmMeasureService.execute({measure_uuid, confirmed_value});

      return response.status(200).json({
        success: true,
      });
    } catch (error) {
       if (error instanceof Error) {
        if (error.message.startsWith("INVALID_DATA")) {
          return response.status(400).json({
            error_code: "INVALID_DATA",
            error_description: error.message.replace("INVALID_DATA: ", ""),
          });
        }

        if (error.message === "MEASURE_NOT_FOUND") {
          return response.status(404).json({
            error_code: "MEASURE_NOT_FOUND",
            error_description: "Leitura não encontrada",
          });
        }

        if (error.message === "CONFIRMATION_DUPLICATE") {
          return response.status(409).json({
            error_code: "CONFIRMATION_DUPLICATE",
            error_description: "Leitura do mês já realizada",
          });
        }
      }

      return response.status(500).json({
        error_code: "INTERNAL_ERROR",
        error_description: "An unexpected error occurred",
      });
    }
    }
}

export default new ConfirmMeasureController();