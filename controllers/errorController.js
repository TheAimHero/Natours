import appError from '../utils/appError.js';

function sendErrorDev(err, req, res) {
  // eslint-disable-next-line no-console
  console.error('ERROR ==> ', err);
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
}

function sendErrorProd(err, req, res) {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      console.log(err.message);
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      // eslint-disable-next-line no-console
      console.error('ERROR ==> ', err);
      return res.status(500).json({
        status: 'error',
        message: 'Something went wrong',
      });
    }
  } else {
    if (err.isOperational) {
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        msg: err.message,
      });
    } else {
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        msg: 'Please try again later',
      });
    }
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
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new appError(message, 400);
}

export default function (err, req, res, _next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    return sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') err = handleCastError(err);
    if (err.code === 11000) err = handleDuplicateField(err);
    if (err.name === 'ValidationError') err = handleValidationError(err);
    if (err.name === 'JsonWebTokenError') {
      err = new appError('Invalid token. Please login again', 401);
    }
    if (err.name === 'TokenExpiredError') {
      err = new appError('Your token has expired. Please login again', 401);
    }
    return sendErrorProd(err, req, res);
  }
}
