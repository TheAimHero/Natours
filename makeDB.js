import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';

import tourModel from './model/tourModel.js';

mongoose.connect(process.env.DATABASE_LOCAL);

const data = JSON.parse(fs.readFileSync('./dev-data/data/tours.json'));

tourModel.insertMany(data).finally(mongoose.disconnect);
