import tourModel from '../model/tourModel.js';
import appError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import * as factory from './factoryHandler.js';

export const getTours = factory.getAll(tourModel);

export const addTour = factory.createOne(tourModel);

export const updateTour = factory.updateOne(tourModel);

export const deleteTour = factory.deleteOne(tourModel);

const populateObj = [
  { path: 'guides', select: '-__v -passwordChangedAt' },
  { path: 'reviews', select: '-__v -createdAt -updatedAt' },
];

export const getTour = factory.getOne(tourModel, populateObj);

// /tours-within/:distance/center/:latlng/unit/:unit
export const getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  if (unit !== 'mi' && unit !== 'km') {
    return next(new appError('Invalid unit', 400));
  }
  if (!lat || !lng) {
    const errMessage =
      'Please provide latitude and longiture in format lat,lng';
    return next(new appError(errMessage, 400));
  }
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  // NOTE: Mongodb stores lat first and lng second
  const tours = await tourModel.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res
    .status(200)
    .json({ status: 'success', results: tours.length, data: tours });
});

export const getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  if (unit !== 'mi' && unit !== 'km') {
    return next(new appError('Invalid unit', 400));
  }
  if (!lat || !lng) {
    const errMessage =
      'Please provide latitude and longiture in format lat,lng';
    return next(new appError(errMessage, 400));
  }
  const distances = await tourModel.aggregate([
    {
      // NOTE: geoNear always must be the first stage
      $geoNear: {
        near: { type: 'Point', coordinates: [lng * 1, lat * 1] },
        distanceField: 'distance',
        distanceMultiplier: unit === 'mi' ? 0.000621371 : 0.001,
      },
    },
    { $project: { distance: 1, name: 1 } },
  ]);
  res.status(200).json({ status: 'success', data: distances });
});

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
