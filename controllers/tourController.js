import tourModel from '../model/tourModel.js';
import apiUtils from '../utils/apiFeatures.js';
import catchAsync from '../utils/catchAsync.js';
import appError from '../utils/appError.js';

export const getTours = catchAsync(async (req, res, next) => {
  const features = new apiUtils(tourModel.find(), req.query)
    .filterQuery()
    .sortBy()
    .sortFields()
    .pagination();
  const tours = await features.query;
  res.status(200).json({
    status: 'success',
    message: 'Tours fetched',
    data: { length: tours.length, tours },
  });
});

export const addTour = catchAsync(async (req, res, next) => {
  const newTour = await tourModel.create(req.body);
  res.status(200).json({ status: 'success', data: newTour });
});

export const patchTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await tourModel.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(new appError('No tours found with the requested id', 404));
  }
  res
    .status(200)
    .json({ status: 'success', message: 'Tour updated', data: tour });
});

export const deleteTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await tourModel.deleteOne({ _id: id });
  if (!tour) {
    return next(new appError('No tours found with the requested id', 404));
  }
  res.status(200).json({ status: 'success' });
});

export const getTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await tourModel.findById(id);
  if (!tour) {
    return next(new appError('No tours found with the requested id', 404));
  }
  res.status(200).json({ status: 'success', data: tour });
});

export const getTourStats = catchAsync(async (_, res, next) => {
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
