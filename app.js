import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';

import appError from './utils/appError.js';
import { tourRouter } from './routes/tourRoutes.js';
import { userRouter } from './routes/userRoutes.js';
import errorController from './controllers/errorController.js';

dotenv.config();

const app = express();

mongoose.connect(process.env.DATABASE_LOCAL).then(console.log('DB connected'));

app.use(express.json());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, _, next) => {
  const message = `Can't find ${req.originalUrl} on this server`;
  const statusCode = 404;
  next(new appError(message, statusCode));
});

app.use(errorController);

const server = app.listen(
  process.env.PORT,
  console.log('Listening at port 3000')
);

process.on('unhandledRejection', (err, _) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting down...');
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err, _) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  server.close(() => process.exit(1));
});
