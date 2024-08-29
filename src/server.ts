import express, { Request, Response, NextFunction } from 'express';
import { router } from './routes';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(router);

app.listen(3001, () => {
    console.log('Listening on port 3001');
});