import mongoose from 'mongoose';

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

reviewSchema.pre(/^find/, function (next) {
  this.select('-__v -createdAt').populate({
    path: 'user',
    select: 'name photo email',
  });
  // .populate({
  //   path: 'tour',
  //   select: 'name ratingsAverage ',
  // });
  // .lean();
  next();
});

export default mongoose.model('Review', reviewSchema);
