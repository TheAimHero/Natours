import express from 'express';

import * as Users from '../controllers/userController.js';

export const userRouter = express.Router();
userRouter.route('/').get(Users.getUsers).post(Users.addUser);
userRouter
  .route('/:id')
  .get(Users.getUser)
  .patch(Users.updateUser)
  .delete(Users.deleteUser);
