import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

const clearDB = asyncHandler(async function clearDB(req, res, next) {
	const collections = mongoose.connection.collections;

	for (const key in collections) {
		const collection = collections[key];
		await collection.deleteMany({});
	}
	return res.status(200).json({ message: `db cleared` })
})
export { clearDB }