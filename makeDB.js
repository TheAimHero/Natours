/* eslint-disable no-unused-vars */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';

import tourModel from './model/tourModel.js';
import usersModel from './model/usersModel.js';
import reviewModel from './model/reviewModel.js';

mongoose.connect(process.env.DATABASE_LOCAL);

const data = JSON.parse(fs.readFileSync('./dev-data/data/tours.json', 'utf-8'));

// tourModel.insertMany(data).finally(mongoose.disconnect);
data.forEach(tour => {
  tourModel.create(tour);
});
