import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import fs from 'fs';
import Cart from '../models/cart.js';
import Order from '../models/order.js';
import User from '../models/user.js';
import Product from '../models/product.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const clearDB = asyncHandler(async function clearDB(req, res, next) {
	const collections = mongoose.connection.collections;

	for (const key in collections) {
		const collection = collections[key];
		await collection.deleteMany({});
	}
	return res.status(200).json({ message: `db cleared` })
})

const seedDB = asyncHandler(async function seedDB(req, res, next) {
	const seedData = JSON.parse(
		fs.readFileSync(`./data/seedData.json`, "utf-8")
	);
	await User.create(seedData.users);
	await Product.create(seedData.products);
	await Cart.create(seedData.carts);
	await Order.create(seedData.orders);
	console.log("Data seed completed");
	return res.status(200).json({ message: "Data seed completed" })
})
export { clearDB, seedDB }