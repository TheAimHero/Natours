import { query } from 'express';
import tourModel from '../model/tourModel.js';

class apiFeaturs {
  constructor(query, queryObj) {
    this.query = query;
    this.queryObj = queryObj;
  }

  filterQuery() {
    let queryString = { ...this.queryObj };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryString[el]);
    queryString = JSON.stringify(queryString).replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      match => `$${match}`
    );
    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }

  sortBy() {
    if (this.queryObj.sort) {
      const sortBy = this.queryObj.sort.replace(',', ' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('price');
    }
    return this;
  }

  sortFields() {
    if (this.queryObj.fields) {
      const fields = this.queryObj.fields.replace(',', ' ');
      this.query = this.query.select(fields);
    } else this.query = this.query.select('-__v');
    return this;
  }

  pagination() {
    const page = this.queryObj.page * 1 || 1;
    const limit = this.queryObj.limit * 1 || 100;
    const skip = (page - 1) * limit;
    if (this.queryObj.page) {
      const numTours = tourModel.countDocuments();
      if (skip >= numTours) throw new Error('Page not found.');
    }
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export default apiFeaturs;
