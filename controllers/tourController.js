import tourModel from '../model/tourModel.js';
import * as apiUtils from '../utils/apiFeatures.js';

export async function getTours(req, res) {
  try {
    let query = tourModel.find(apiUtils.filterQuery({ ...req.query }));
    query = apiUtils.sortBy(query, req.query);
    query = apiUtils.sortFields(query, req.query);
    query = apiUtils.pagination(query, req.query);
    const tours = await query;
    res.status(200).json({
      status: 'success',
      message: 'Tours fetched',
      data: { length: tours.length, tours },
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err.message });
  }
}

export async function addTour(req, res) {
  try {
    const newTour = await tourModel.create(req.body);
    res.status(200).json({ status: 'success', data: newTour });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
}

export async function patchTour(req, res) {
  try {
    const { id } = req.params;
    const tour = await tourModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res
      .status(200)
      .json({ status: 'success', message: 'Tour updated', data: tour });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err.message });
  }
}

export async function deleteTour(req, res) {
  try {
    const { id } = req.params;
    await tourModel.findByIdAndDelete(id);
    res.status(200).json({ status: 'success' });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err.message });
  }
}

export async function getTour(req, res) {
  try {
    const { id } = req.params;
    const tour = await tourModel.findById(id);
    res.status(200).json({ status: 'success', data: tour });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err.message });
  }
}
