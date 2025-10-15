import asyncHandler from 'express-async-handler';

export default  asyncHandler(async (req, res, next) => {
  if (!["dev", "development"].includes(process.env.ENV)) {
	throw new Error("not a dev environment")
  }
  return next()
})
