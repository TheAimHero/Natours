import multer from 'multer';
import sharp from 'sharp';

import usersModel from '../model/usersModel.js';
import appError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { filterObj } from '../utils/filterObj.js';
import * as factory from './factoryHandler.js';

const multerStorage = multer.memoryStorage();

const multerFileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new appError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFileFilter });

export const getUsers = factory.getAll(usersModel);

export const getMe = (req, _res, next) => {
  req.params.id = req.user.id;
  next();
};

export const uploadUserPhoto = upload.single('photo');

export const resizePhoto = catchAsync(async (req, _res, next) => {
  if (!req.file.mimetype.startsWith('image')) return next();
  const ext = req.file.mimetype.split('/')[1];
  req.file.filename = `user-${req.user._id}-${Date.now()}.${ext}`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
});

export const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password)
    return next(
      new appError(
        'Please do not update password. Please use /update-password',
        400
      )
    );
  const allowedFields = ['name', 'email'];
  const updateContent = filterObj(req.body, allowedFields);
  if (req.file) updateContent.photo = req.file.filename;

  const updatedUser = await usersModel.findByIdAndUpdate(
    req.user.id,
    updateContent,
    { new: true, runValidators: true }
  );
  res.status(200).json({
    status: 'success',
    data: { user: updatedUser },
  });
});

export const deleteMe = catchAsync(async (req, res, _next) => {
  await usersModel.findByIdAndUpdate(req.user.id, { activated: false });
  res.status(204).json({ status: 'success', data: null });
});

export const updateUser = factory.updateOne(usersModel);

export const getUser = factory.getOne(usersModel);

export const deleteUser = factory.deleteOne(usersModel);
