import { Router } from 'express';
import CreateMeasureController from './controllers/CreateMeasureController';

const router = Router();

router.post('/upload', CreateMeasureController.handle);

export { router };