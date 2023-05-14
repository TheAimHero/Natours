import tourModel from '../model/tourModel.js';

export function filterQuery(query) {
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(el => delete query[el]);
  query = JSON.stringify(query).replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    match => `$${match}`
  );
  return JSON.parse(query);
}

export function sortBy(query, reqQuery) {
  if (reqQuery.sort) {
    const sortBy = reqQuery.sort.replace(',', ' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('price');
  }
  return query;
}

export function sortFields(query, reqQuery) {
  if (reqQuery.fields) {
    const fields = reqQuery.fields.replace(',', ' ');
    query = query.select(fields);
  } else query = query.select('-__v');
  return query;
}

export async function pagination(query, reqQuery) {
  const page = reqQuery.page * 1 || 1;
  const limit = reqQuery.limit * 1 || 10;
  const skip = (page - 1) * limit;
  if (reqQuery.page) {
    const numTours = await tourModel.countDocuments();
    if (skip >= numTours)
      throw new Error('Page not found. It is out of Bounds');
  }
  query = query.skip(skip).limit(limit);
  return query;
}
