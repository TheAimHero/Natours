import express from 'express';

import * as Reviews from '../controllers/reviewController.js';
import * as auth from '../controllers/authController.js';

export const reviewRouter = express.Router({ mergeParams: true });

reviewRouter
  .use(auth.protect)
  .route('/')
  .get(auth.restrict('admin', 'user', 'lead-guide'), Reviews.getReviews)
  .post(auth.restrict('user'), Reviews.setTourUserId, Reviews.createReview);

reviewRouter.use(auth.protect).route('/:id').get(Reviews.getReview);

reviewRouter
  .use(auth.restrict('user'))
  .route('/:id')
  .delete(Reviews.deleteReview)
  .patch(Reviews.updateReview);
