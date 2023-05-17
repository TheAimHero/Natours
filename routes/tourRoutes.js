import express from 'express';

import * as Tours from '../controllers/tourController.js';
import { protect } from '../controllers/authController.js';

export const tourRouter = express.Router();

tourRouter.route('/').get(protect, Tours.getTours).post(Tours.addTour);

tourRouter.route('/tour-stats').get(Tours.getTourStats);

tourRouter.route('/monthly-plan/:year').get(Tours.getMonthlyPlan);

tourRouter
  .route('/:id')
  .get(Tours.getTour)
  .patch(Tours.patchTour)
  .delete(Tours.deleteTour);
