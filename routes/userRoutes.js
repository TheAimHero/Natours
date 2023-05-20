import express from 'express';
import * as Users from '../controllers/userController.js';
import * as auth from '../controllers/authController.js';

export const userRouter = express.Router();

userRouter.post('/signup', auth.signUp);
userRouter.post('/login', auth.login);
userRouter.post('/forgot-password', auth.forgotPassword);
userRouter.patch('/reset-password/:token', auth.resetPassword);

userRouter.use(auth.protect);

userRouter.route('/get-me').get(Users.getMe, Users.getUser);

userRouter.patch('/update-password', auth.updatePassword);

userRouter.patch('/update-me', auth.restrict('user'), Users.updateMe);
userRouter.delete('/delete-me', auth.restrict('user'), Users.deleteMe);

userRouter.route('/').get(auth.restrict('admin', 'lead-guide'), Users.getUsers);

userRouter
  .route('/:id')
  .patch(auth.restrict('user'), Users.updateUser)
  .delete(auth.restrict('admin'), Users.deleteUser)
  .get(auth.restrict('admin', 'lead-guide'), Users.getUser);
