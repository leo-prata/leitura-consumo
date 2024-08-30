import e from 'express';
import prismaClient from '../prisma';

interface ConfirmMeasureRequest{
    measure_uuid: string;
    confirmed_value: number;
}

class CreateConfirmMeasureService {
  public async execute({ measure_uuid, confirmed_value }: ConfirmMeasureRequest) {
    
    if (!measure_uuid || typeof measure_uuid !== 'string') {
        throw new Error("INVALID_DATA: Measure UUID is required and must be a string");
    }
  
    if (typeof confirmed_value !== 'number' || isNaN(confirmed_value)) {
        throw new Error("INVALID_DATA: Confirmed value must be a valid number");
    }
    
    const measure = await prismaClient.measure.findUnique({
        where: { measureUuid: measure_uuid },
    });

    if (!measure) {
        throw new Error("Measure not found");
    }

    if (measure.hasConfirmed) {
        throw new Error("Measure has already been confirmed");
    }
  
    const updatedMeasure = await prismaClient.measure.update({
        where: { measureUuid: measure_uuid },
        data: {
          measureValue: confirmed_value,
          hasConfirmed: true,
        },
    });
  
    return updatedMeasure;
    }
}

export default new CreateConfirmMeasureService();