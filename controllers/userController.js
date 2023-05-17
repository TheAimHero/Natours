import usersModel from '../model/usersModel.js';
import catchAsync from '../utils/catchAsync.js';

export const getUsers = catchAsync(async (_, res, __) => {
  const users = await usersModel.find();
  res.status(200).json({ status: 'success', data: { users } });
});

export function updateUser(req, res) {
  const { id } = req.params;
  const user = users.find(user => user.id === id);
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
  const user = users.find(user => user.id === id);
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
