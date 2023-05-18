import crypto from 'crypto';

import validator from 'validator';

import catchAsync from '../utils/catchAsync.js';
import usersModel from '../model/usersModel.js';
import appError from '../utils/appError.js';
import * as tokenUtils from '../utils/tokenUtils.js';
import { sendEmail } from '../utils/email.js';

export const signUp = catchAsync(async (req, res, _) => {
  const { name, email, password, passwordConfirm, passwordChangedAt } =
    req.body;
  const newUser = await usersModel.create({
    name: String(name),
    email: String(email),
    password: String(password),
    passwordConfirm: String(passwordConfirm),
  });
  user.password = user.passwordChangedAt = undefined;
  createSendToken(user, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new appError('Please provide email and password', 400));
  }
  if (typeof email !== 'string' || typeof password !== 'string') {
    return next(new appError('Invalid email or password', 400));
  }
  const user = await usersModel.findOne({ email }).select('+password');
  const correct = user && (await user.correctPassword(password, user.password));
  if (!correct) {
    return next(new appError('Incorrect Credentials', 401));
  }

  user.password = user.passwordChangedAt = undefined;
  createSendToken(user, 200, res);
});

export const protect = catchAsync(async (req, _, next) => {
  let token =
    req.headers.authorization &&
    tokenUtils.extractToken(req.headers.authorization);

  const decoded = token && (await tokenUtils.verifyToken(token));
  if (!decoded) return next(new appError('You are not logged in!', 401));

  const freshUser = await usersModel.findById(decoded.id);
  if (!freshUser) return next(new appError('User with token not found', 404));

  if (freshUser.changePassword(decoded.iat)) {
    return next(new appError('Password changed. Login again', 401));
  }

  req.user = freshUser;

  next();
});

export const restrict = (...roles) => {
  return (req, _, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new appError('No suffiecient permissions', 403));
    }
    next();
  };
};

export const forgotPassword = catchAsync(async (req, res, next) => {
  const email = String(req.body.email);
  if (!validator.isEmail(email)) {
    return next(new appError('Invalid email', 400));
  }
  const user = await usersModel.findOne({ email });
  console.log(user);
  if (!user) return next(new appError('User not found', 404));
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail(email, 'Your password reset token', message);
    res
      .status(200)
      .json({ status: 'success', message: 'Token sent to email!' });
  } catch (err) {
    console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new appError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await usersModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) return next(new appError('Token is invalid or has expired', 400));
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  createSendToken(user, 200, res);
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const { oldPassword, newPassword, passwordConfirm } = req.body;

  const user = await usersModel.findById(req.user._id).select('+password');
  if (!user) return next(new appError('User not found or invalid token', 404));

  const correct = await user.correctPassword(
    String(oldPassword),
    user.password
  );
  if (!correct) return next(new appError('Incorrect Credentials', 401));

  user.password = newPassword;
  user.passwordConfirm = passwordConfirm;
  await user.save();
  user.password = user.passwordChangedAt = undefined;
  createSendToken(user, 200, res);
});

export function createSendToken(user, statusCode, res) {
  res.cookie('jwt', tokenUtils.signToken(user._id), {
    secure: process.env.NODE_ENV === 'development' ? false : true,
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  });
  const token = tokenUtils.signToken(user._id);
  res.status(statusCode).json({ status: 'success', token, data: user });
}
