import tourModel from '../model/tourModel.js';
import catchAsync from '../utils/catchAsync.js';

export const getOverview = catchAsync(async (_req, res, _next) => {
  const tours = await tourModel.find();
  res.status(200).render('overview', {
    title: 'Exciting tours for adventurous people',
    tours,
  });
});

export const getAccount = (_req, res) => {
  res.status(200).render('account', { title: 'Your account' });
};

export const getTour = catchAsync(async (req, res, _next) => {
  const tour = await tourModel
    .findOne({ slug: req.params.slug })
    .populate({ path: 'guides', select: 'role photo email name' })
    .populate({ path: 'reviews', select: 'name photo review rating' });
  res.status(200).render('tour', {
    mapboxToken: process.env.MAPBOX_TOKEN,
    title: tour.name,
    tour,
  });
});

export const loginUser = catchAsync(async (_req, res, _next) => {
  res.status(200).render('login', { title: 'Login' });
});
