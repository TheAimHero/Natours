import { promisify } from 'util';

import jwt from 'jsonwebtoken';

export function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

export function extractToken(req) {
  let token = undefined;
  if (req.headers.authorization) {
    const tokenStr = req.headers.authorization;
    if (tokenStr.startsWith('Bearer ')) {
      token = tokenStr.split(' ')[1];
    }
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  return token;
}

export async function verifyToken(token) {
  return await promisify(jwt.verify)(token, process.env.JWT_SECRET);
}
