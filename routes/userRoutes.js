import express from 'express';
import * as Users from '../controllers/userController.js';
import { signUp, login } from '../controllers/authController.js';

export const userRouter = express.Router();

userRouter.route('/').get(Users.getUsers);

userRouter.post('/signup', signUp);

userRouter.post('/login', login);

userRouter
  .route('/:id')
  // .get(Users.getUser)
  .patch(Users.updateUser)
  .delete(Users.deleteUser);
