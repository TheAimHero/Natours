import reviewModel from '../model/reviewModel.js';
import * as factory from './factoryHandler.js';

export function setTourUserId(req, _res, next) {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
}

export const getReviews = factory.getAll(reviewModel);
export const createReview = factory.createOne(reviewModel);
export const deleteReview = factory.deleteOne(reviewModel);
export const updateReview = factory.updateOne(reviewModel);

const populateOptionsArray = [{ path: 'user' }];
export const getReview = factory.getOne(reviewModel, populateOptionsArray);
