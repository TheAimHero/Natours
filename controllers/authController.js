import catchAsync from '../utils/catchAsync.js';
import usersModel from '../model/usersModel.js';
import appError from '../utils/appError.js';
import * as tokenUtils from '../utils/tokenUtils.js';
export const signUp = catchAsync(async (req, res, _) => {
  const { name, email, password, passwordConfirm, passwordChangedAt } =
    req.body;
  const newUser = await usersModel.create({
    name,
    email,
    password,
    passwordChangedAt,
    passwordConfirm,
  });
  const token = tokenUtils.signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: { user: { name, email, id: newUser._id } },
  });
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
  const token = tokenUtils.signToken(String(user._id));
  res.status(200).json({ status: 'success', token });
});

export const protect = catchAsync(async (req, res, next) => {
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
