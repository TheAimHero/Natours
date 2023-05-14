import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';

import { tourRouter } from './routes/tourRoutes.js';
import { userRouter } from './routes/userRoutes.js';

dotenv.config();

const app = express();

mongoose.connect(process.env.DATABASE_LOCAL).then(console.log('DB connected'));

app.use(express.json());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.listen(process.env.PORT, console.log('Listening at port 3000'));
