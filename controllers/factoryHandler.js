import catchAsync from '../utils/catchAsync.js';
import appError from '../utils/appError.js';
import apiUtils from '../utils/apiFeatures.js';

export function deleteOne(Model) {
  return catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndDelete(id);
    if (!doc) {
      return next(new appError(`No document found with the requested id`, 404));
    }
    res.status(200).json({ status: 'success', data: null });
  });
}

export function updateOne(Model) {
  return catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new appError('No document found with the requested id', 404));
    }
    res
      .status(200)
      .json({ status: 'success', message: 'Document updated', data: doc });
  });
}

export function createOne(Model) {
  return catchAsync(async (req, res, _next) => {
    const doc = await Model.create(req.body);
    res.status(200).json({ status: 'success', data: doc });
  });
}

export function getOne(Model, populateOptionsArray) {
  return catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptionsArray) {
      populateOptionsArray.forEach(opts => (query = query.populate(opts)));
    }
    query.lean();
    const doc = await query;
    if (!doc) {
      return next(new appError(`No document found with the requested id`, 404));
    }
    res.status(200).json({ status: 'success', data: doc });
  });
}

export function getAll(Model) {
  return catchAsync(async (req, res, _next) => {
    //@todo: add filter only for reviews fix later
    const filter = req.params.tourId ? { tour: req.params.tourId } : {};
    const features = new apiUtils(Model.find(filter), req.query)
      .filterQuery()
      .sortBy()
      .sortFields()
      .pagination();
    features.query = features.query.lean();
    const doc = await features.query;
    res.status(200).json({
      status: 'success',
      message: 'Documents fetched',
      data: doc,
    });
  });
}
