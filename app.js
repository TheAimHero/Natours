import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';

import { tourRouter } from './routes/tourRoutes.js';
import { userRouter } from './routes/userRoutes.js';

dotenv.config();
const app = express();

app.use(express.json());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(morgan('dev'));
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.listen(process.env.PORT, console.log('Listening at port 3000'));
