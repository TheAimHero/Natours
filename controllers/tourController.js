import tourModel from '../model/tourModel.js';
import catchAsync from '../utils/catchAsync.js';
import * as factory from './factoryHandler.js';

export const getTours=factory.getAll(tourModel);

export const addTour = factory.createOne(tourModel);

export const updateTour = factory.updateOne(tourModel);

export const deleteTour = factory.deleteOne(tourModel);

const populateObj = [
  { path: 'guides', select: '-__v -passwordChangedAt' },
  { path: 'reviews', select: '-__v -createdAt -updatedAt' },
];

export const getTour = factory.getOne(tourModel, populateObj);

export const getTourStats = catchAsync(async (_req, res, _next) => {
  const stats = await tourModel.aggregate([
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        numToursRating: { $sum: '$ratingsQuantity' },
        avgToursRating: { $avg: '$ratingsAverage' },
        avgToursPrice: { $avg: '$price' },
        maxToursPrice: { $max: '$price' },
        minToursPrice: { $min: '$price' },
      },
    },
  ]);
  res
    .status(200)
    .json({ status: 'success', message: 'Tour stats fetched', data: stats });
});

export const getMonthlyPlan = catchAsync(async (req, res) => {
  const year = req.params.year * 1;
  const plan = await tourModel.aggregate([
    { $unwind: '$startDates' },

    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },

    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },

    { $addFields: { month: '$_id' } },

    { $project: { _id: 0 } },

    { $sort: { month: 1 } },
  ]);
  res
    .status(200)
    .json({ status: 'success', message: 'Plan fetched', data: plan });
});
