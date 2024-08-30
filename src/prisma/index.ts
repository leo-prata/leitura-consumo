import { PrismaClient, Measure as PrismaMeasure } from '@prisma/client';

const prismaClient = new PrismaClient();

export default prismaClient;
export type Measure = PrismaMeasure;