import express from 'express';
import * as Users from '../controllers/userController.js';
import * as auth from '../controllers/authController.js';

export const userRouter = express.Router();

userRouter.route('/').get(Users.getUsers);

userRouter.post('/signup', auth.signUp);

userRouter.post('/forgot-password', auth.forgotPassword);

userRouter.patch('/reset-password/:token', auth.resetPassword);

userRouter.patch('/update-password', auth.protect, auth.updatePassword);

userRouter.patch('/update-me', auth.protect, Users.updateMe);

userRouter.delete('/delete-me', auth.protect, Users.deleteMe);

userRouter.post('/login', auth.login);

userRouter
  .route('/:id')
  // .get(Users.getUser)
  .patch(Users.updateUser)
  .delete(Users.deleteUser);
