import { Router } from 'express';
import CreateMeasureController from './controllers/CreateMeasureController';
import ConfirmMeasureController from './controllers/ConfirmMeasureController';

const router = Router();

router.post('/upload', CreateMeasureController.handle);
router.patch('/confirm', ConfirmMeasureController.handle);

export { router };