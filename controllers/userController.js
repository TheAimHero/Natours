import usersModel from '../model/usersModel.js';
import appError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { filterObj } from '../utils/filterObj.js';

export const getUsers = catchAsync(async (_, res, __) => {
  const users = await usersModel.find();
  res.status(200).json({ status: 'success', data: { users } });
});

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

export const deleteMe = catchAsync(async (req, res, next) => {
  await usersModel.findByIdAndUpdate(req.user.id, { activated: false });
  res.status(204).json({ status: 'success', data: null });
});

export function updateUser(req, res) {
  const { id } = req.params;
  const user = users.find((user) => user.id === id);
  if (!user) {
    res.status(404).json({ status: 'fail', message: 'User not found' });
  } else {
    res.status(200).json({
      status: 'success',
      message: 'User updated',
      data: { user: req.user },
    });
  }
}

export function deleteUser(req, res) {
  const { id } = req.params;
  const user = users.find((user) => user.id === id);
  if (!user) {
    res.status(404).json({ status: 'fail', message: 'User not found' });
  } else {
    res.status(200).json({
      status: 'success',
      message: 'User deleted',
      data: { user: req.user },
    });
  }
}
