import Cart from "../models/cart.js"
import Product from "../models/product.js"
import asyncHandler from 'express-async-handler';

const createCart = asyncHandler(async function(req, res, next) {
    const productIDs = req.body.products.map(product => product.product)
    const products = await Product.find({_id : {$in : productIDs}})
    if (productIDs.length!==products.length) { res.status(422).json("Couldn't find some products")}
    await Cart.deleteMany({creator : req.userID})
    const cart = new Cart({creator : req.userID, products : req.body.products})
    await cart.save()
    res.status(201).json({message : "cart created", id : cart._id})
})
const getLatestCart = async function(req, res, next) {
    const cart = await Cart.findOne({creator : req.userID})
    res.status(200).json(cart.toJSON())

}
export {createCart, getLatestCart}