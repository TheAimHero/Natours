import usersModel from '../model/usersModel.js';
import appError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { filterObj } from '../utils/filterObj.js';
import * as factory from './factoryHandler.js';

export const getUsers = factory.getAll(usersModel);

export const getMe = (req, _res, next) => {
  req.params.id = req.user.id;
  next();
};

export const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password)
    return next(
      new appError(
        'Please do not update password. Please use /update-password',
        400
      )
    );
  const allowedFields = ['name', 'email'];
  const updateContent = filterObj(req.body, allowedFields);
  const updatedUser = await usersModel.findByIdAndUpdate(
    req.user.id,
    updateContent,
    { new: true, runValidators: true }
  );
  res.status(200).json({
    status: 'success',
    data: { user: updatedUser },
  });
});

export const deleteMe = catchAsync(async (req, res, _next) => {
  await usersModel.findByIdAndUpdate(req.user.id, { activated: false });
  res.status(204).json({ status: 'success', data: null });
});

export const updateUser = factory.updateOne(usersModel);

export const getUser = factory.getOne(usersModel);

export const deleteUser = factory.deleteOne(usersModel);
