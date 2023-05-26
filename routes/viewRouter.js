import express from 'express';
import * as auth from '../controllers/authController.js';

import * as View from '../controllers/viewController.js';

export const viewRouter = express.Router();

viewRouter.use(auth.isLoggedIn);

viewRouter.get('/', View.getOverview);

viewRouter.get('/login', View.loginUser);

viewRouter.get('/tour/:slug', View.getTour);
