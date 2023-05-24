import mongoose from 'mongoose';

import tourModel from './tourModel.js';

const reviewSchema = new mongoose.Schema(
  {
    review: { type: String, required: true },

    rating: {
      type: Number,
      required: [true, 'Review cannot be empty'],
      max: [5, 'Rating must be less than 5'],
      min: [0, 'Rating must be more than 0'],
    },

    createdAt: { type: Date, select: false, default: Date.now() },

    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        nRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  await tourModel.findByIdAndUpdate(
    tourId,
    { ratingsAverage: stats[0].avgRating, ratingsQuantity: stats[0].nRatings },
    { new: true, runValidators: true }
  );
};

// NOTE: don't use lean() causes the removal of necessary data ( downstream ) from query
reviewSchema.pre(/^find/, function (next) {
  this.select('-__v -createdAt').populate({
    path: 'user',
    select: 'name photo email',
  });
  // .populate({
  //   path: 'tour',
  //   select: 'name ratingsAverage ',
  // });
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  const r = await this.findOne().clone();
  await r.constructor.calcAverageRatings(r.tour);
});

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour);
});

export default mongoose.model('Review', reviewSchema);
