import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour must have a name'],
      unique: [true, 'Tour name must be unique'],
      maxlength: [40, 'Tour name must be less than 40 characters'],
      minlength: [10, 'Tour name must be more than 10 characters'],
      trim: true,
    },

    duration: { type: Number, required: [true, 'Tour must have a duration'] },

    maxGroupSize: {
      type: Number,
      required: [true, 'Tour must have a group size'],
      min: 1,
    },

    difficulty: {
      type: String,
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be easy, medium or difficult',
      },
      trim: true,
    },

    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      max: [10, 'Ratings must be less than 10'],
      min: [0, 'Ratings must be more than 0'],
    },

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
      trim: true,
    },

    images: {
      type: [String],
      required: [true, 'Tour must have images'],
      trim: true,
    },

    createdAt: { type: Date, select: false, default: Date.now() },

    startDates: { type: [Date], default: Date.now() },

    secretTour: { type: Boolean, default: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('tourDurationWeek').get(function () {
  return this.duration / 7;
});

tourSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.post(/^find/, function (doc, next) {
  console.log(`The query took ${Date.now() - this.start} milliseconds`);
  next();
});

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

export default mongoose.model('Tour', tourSchema);
