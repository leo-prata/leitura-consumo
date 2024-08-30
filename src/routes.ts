import { Router } from 'express';
import CreateMeasureController from './controllers/CreateMeasureController';
import ConfirmMeasureController from './controllers/ConfirmMeasureController';
import ListMeasuresController from './controllers/ListMeasuresController';

const router = Router();

router.post('/upload', CreateMeasureController.handle);
router.patch('/confirm', ConfirmMeasureController.handle);
router.get('/:customer_code/list', ListMeasuresController.handle);

export { router };