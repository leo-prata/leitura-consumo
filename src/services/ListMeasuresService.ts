import prismaClient, { Measure } from '../prisma';

interface MeasuresList{
    customer_code: string; 
    measure_type?: string;
}

class ListMeasuresService{
    async execute({customer_code, measure_type}: MeasuresList){
        const customer = await prismaClient.customer.findUnique({
            where: { customerCode: customer_code },
            include: {
              measures: measure_type
                ? {
                    where: {
                      measureType: {
                        equals: measure_type.toUpperCase(),
                        mode: 'insensitive'
                      },
                    },
                  }
                : true,
            },
          });
      
          if (!customer) {
            throw new Error("CUSTOMER_NOT_FOUND");
          }
      
          return {
            customer_code: customer.customerCode,
            measures: customer.measures.map((measure: Measure) => ({
              measure_uuid: measure.measureUuid,
              measure_datetime: measure.measureDatetime,
              measure_type: measure.measureType,
              has_confirmed: measure.hasConfirmed,
              image_url: measure.imageUrl,
            })),
          };

    }
}

export default new ListMeasuresService();