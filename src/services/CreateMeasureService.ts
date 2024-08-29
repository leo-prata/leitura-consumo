import prismaClient from '../prisma';

interface MeasureRequest{
    image: string;
    customer_code: string;
    measure_datetime: Date;
    measure_type: 'WATER' | 'GAS';
    measure_value: number;
}

class CreateMeasureService {
  public async execute({image, customer_code, measure_datetime, measure_type, measure_value}: MeasureRequest) {
    
    const normalizedMeasureType = measure_type.toUpperCase();

    let customer = await prismaClient.customer.findUnique({
        where: { customerCode: customer_code },
    });
    if (!customer) {
        customer = await prismaClient.customer.create({
            data: {
                customerCode: customer_code,
            },
        });
    }

    const measure = await prismaClient.measure.create({
        data: {
            measureDatetime: measure_datetime,
            measureType: normalizedMeasureType,
            imageUrl: image,
            measureValue: measure_value,
            customer: {
                connect: { id: customer.id },
            },
        },
    });

    return measure;

  }
}

export default new CreateMeasureService();