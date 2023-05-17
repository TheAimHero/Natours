import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'User must have a name'] },

  email: {
    type: String,
    required: true,
    unique: [true, 'User must have a unique email'],
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Please enter a valid email'],
  },

  photo: { type: String },

  password: {
    type: String,
    required: [true, 'User must have a password'],
    select: false,
    minlength: 8,
  },

  passwordChangedAt: { type: Date },

  passwordConfirm: {
    type: String,
    required: [true, 'User must confirm password'],
    validate: {
      //Works only on save
      validator: function (val) {
        return val === this.password;
      },
      message: 'Passwords are not the same.',
    },
  },
});

//prettier-ignore
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePassword = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changeTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changeTimeStamp, JWTTimeStamp);
    return JWTTimeStamp < changeTimeStamp;
    //if jwttimestamp is less than the time of password change that means the token is invalid (evaluates to true)
    // else the token is valid as it was created after the password change (evaluates to false)
  }
  return false;
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, process.env.SALT_ROUNDS * 1);
  this.passwordConfirm = undefined;
  next();
});

export default mongoose.model('User', userSchema);
