import express from 'express';

import * as Tours from '../controllers/tourController.js';

export const tourRouter = express.Router();

tourRouter.param('id', Tours.checkId);

tourRouter.route('/').get(Tours.getTours).post(Tours.checkBody, Tours.addTour);

tourRouter
  .route('/:id')
  .get(Tours.getTour)
  .patch(Tours.patchTour)
  .delete(Tours.deleteTour);
