import { Request, Response } from 'express';
import ListMeasuresService from '../services/ListMeasuresService';

class ListMeasuresController{
    async handle(request: Request, response: Response): Promise<Response>{
        const { customer_code } = request.params as { customer_code: string };
        const { measure_type } = request.query as { measure_type: string };

        if (measure_type && !['WATER', 'GAS'].includes(measure_type.toUpperCase())) {
            return response.status(400).json({
              error_code: "INVALID_TYPE",
              error_description: "Tipo de medição não permitida",
            });
        }

        try{
            const result = await ListMeasuresService.execute({customer_code, measure_type: measure_type as string});
            return response.status(200).json(result);
        } catch (error) {
            if (error instanceof Error && error.message === "CUSTOMER_NOT_FOUND") {
              return response.status(404).json({
                error_code: "CUSTOMER_NOT_FOUND",
                error_description: "Cliente não encontrado",
              });
            }
      
            return response.status(500).json({
              error_code: "INTERNAL_ERROR",
              error_description: "Erro ao listar medidas",
            });
          }
    }
}

export default new ListMeasuresController();