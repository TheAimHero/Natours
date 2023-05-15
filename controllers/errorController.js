import appError from '../utils/appError.js';

function sendErrorDev(err, res) {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    stack: err.stack,
  });
}

function sendErrorProd(err, res) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('ERROR ==> ', err);
    res.status(err.statusCode).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
}

function handleCastError(err) {
  const message = `${err.path}: ${err.value} is invalid.`;
  return new appError(message, 400);
}

function handleDuplicateField(err) {
  const message = `The name '${err.keyValue.name}' already exists. Please use another value.`;
  return new appError(message, 400);
}

function handleValidationError(err) {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new appError(message, 400);
}

export default function (err, _, res, __) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    return sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') err = handleCastError(err);
    if (err.code === 11000) err = handleDuplicateField(err);
    if (err.name === 'ValidationError') err = handleValidationError(err);
    return sendErrorProd(err, res);
  }
}
