import { promisify } from 'util';

import jwt from 'jsonwebtoken';

export function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

export function extractToken(tokenStr) {
  let token = undefined;
  if (tokenStr.startsWith('Bearer ')) {
    token = tokenStr.split(' ')[1];
  }
  return token;
}

export async function verifyToken(token) {
  return await promisify(jwt.verify)(token, process.env.JWT_SECRET);
}
