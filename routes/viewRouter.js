import express from 'express';

import * as View from '../controllers/viewController.js';

export const viewRouter = express.Router();

viewRouter.get('/', View.getOverview);

// viewRouter.get('/overview', (_req, res) => {
//   res.status(200).render('overview', { title: 'The Forest Hiker' });
// });

viewRouter.get('/tour/:slug', View.getTour);
