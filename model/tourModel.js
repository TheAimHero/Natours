import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour must have a name'],
    unique: [true, 'Tour name must be unique'],
  },

  duration: { type: Number, required: [true, 'Tour must have a duration'] },

  maxGroupSize: {
    type: Number,
    required: [true, 'Tour must have a group size'],
    min: 1,
  },

  difficulty: { type: String },

  ratingsAverage: { type: Number, default: 4.5, max: 10 },

  ratingsQuantity: { type: Number, default: 0 },

  price: { type: Number, required: [true, 'Tour must have a price'] },

  summary: {
    type: String,
    required: [true, 'Tour must have a summary'],
    trim: true,
  },

  description: {
    type: String,
    required: [true, 'Tour must have a description'],
    trim: true,
  },

  imageCover: {
    type: String,
    required: [true, 'Tour must have a cover image'],
  },

  images: {
    type: [String],
    required: [true, 'Tour must have images'],
    trim: true,
  },

  createdAt: { type: Date, select: false, default: Date.now() },

  startDates: { type: [Date], default: Date.now() },
});

export default mongoose.model('Tour', tourSchema);
