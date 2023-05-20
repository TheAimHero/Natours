import express from 'express';

import * as Tours from '../controllers/tourController.js';
import { protect, restrict } from '../controllers/authController.js';
import { reviewRouter } from '../routes/reviewRoutes.js';
import * as auth from '../controllers/authController.js';

export const tourRouter = express.Router();

tourRouter.use('/:tourId/reviews', reviewRouter);

tourRouter
  .route('/')
  .get(Tours.getTours)
  .post(auth.protect, auth.restrict('admin', 'lead-guide'), Tours.addTour);

tourRouter.route('/tour-stats').get(Tours.getTourStats);

tourRouter
  .route('/monthly-plan/:year')
  .get(
    auth.protect,
    auth.restrict('admin', 'lead-guide', 'guide'),
    Tours.getMonthlyPlan
  );

tourRouter
  .route('/:id')
  .get(Tours.getTour)
  .patch(auth.protect, auth.restrict('admin', 'lead-guide'), Tours.updateTour)
  .delete(protect, restrict('admin', 'lead-guide'), Tours.deleteTour);
