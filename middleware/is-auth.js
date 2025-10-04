import pkg from 'jsonwebtoken';
const { verify } = pkg;
import User from '../models/user.js';
import asyncHandler from 'express-async-handler';

export default  asyncHandler(async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not authenticated.');
    error.status = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1];
  // const token = authHeader;
  let decodedToken;
  try {
    decodedToken = verify(token, process.env.JWT_TOKEN);
  } catch (err) {
    err.status = 401;
    err.originalMessage = err.message
    err.message = "Could not authenticate."
    return next(err)
  }
  const error = new Error('Not authenticated.');
  error.status = 401;
  if (!decodedToken) {
    return next(error)
  }
  else {
    const user = await User.findById(decodedToken.userID)
    if (!user || (decodedToken.createdAt < user.lastPasswordChangeDate)) {
      return next(error)
    } else {
      req.userID = decodedToken.userID;
      req.user = user
      return next();
    }
  }
})
