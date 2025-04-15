import Product from "../models/product.js";
import asyncHandler from 'express-async-handler';

const addProduct = asyncHandler(async function addProduct(req, res, next) {
    if (req.body.image!==undefined && !req.file) {
        res.status(422).json({message : "Invalid image type"})
    }
    const product = new Product({name : req.body.name, provider : req.userID, price : req.body.price, stock : req.body.stock, enabled : req.body.enabled, image : req.file ? req.file.path : null })
    const result = await product.save()
    res.status(201).json({message : `product created`, productID : result._id})
})
const editProduct = asyncHandler(async function editProduct(req, res, next) {
    if (req.body.image!==undefined && !req.file) {
        res.status(422).json({message : "Invalid image type"})
    }
    const productID = req.params.productID
    const product = await Product.findById(productID)
    if (!product) {
        res.status(404).json({message : "couldn't find that product"})
    } else if (product.provider.toString()!==req.userID && !req.user.admin) {
        res.status(403).json({message : "That's not your product"})
    } else {
        for (let key of Object.keys(req.body).filter(key => !["provider", "image"].includes(key))) {
            product[key] = req.body[key]
        }
        if (req.file) {
            product.image = req.file.path
        }
        product.modifiedAt = new Date.now()
        await product.save()
        res.status(200).json({message : "product updated successfully"})
    }
})
const getProducts = asyncHandler(async function(req, res, next) {
    const { sortBy = 'createdAt', order = 'asc' } = req.query;
    let sortCriteria = {};
    if (['price', 'createdAt'].includes(sortBy)) {
        sortCriteria[sortBy] = order === 'desc' ? -1 : 1;
    } else {
        sortCriteria = { createdAt: 1 };
    }
    const products = await Product.find({ enabled: true, stock: { $gt: 0 } }).sort(sortCriteria);
    res.status(200).json(products.map(product => product.toJSON()));
});

const getProduct = asyncHandler(async function(req, res, next) {
    const product = await Product.findById(req.params.productID);
    if (!product) {
        res.status(404).json({
            message : "product not found"
        })
    }
    else {
        res.status(200).json(product.toJSON());
    }
});
const searchProducts = asyncHandler(async function(req, res, next) {

})
const getUserProducts = asyncHandler(async function(req, res, next) {
    const { sortBy = 'createdAt', order = 'asc' } = req.query;
    const userID = req.params.userID
    let sortCriteria = {};
    if (['price', 'createdAt'].includes(sortBy)) {
        sortCriteria[sortBy] = order === 'desc' ? -1 : 1;
    } else {
        sortCriteria = { createdAt: 1 };
    }
    const products = await Product.find({ enabled: true, stock: { $gt: 0 }, provider : userID }).sort(sortCriteria);
    res.status(200).json(products.map(product => product.toJSON()));
})
const deleteProduct = asyncHandler(async function deleteProduct(req, res, next) {
    const productID = req.params.productID
    const product = await Product.findById(productID)
    if (!product) {
        res.status(404).json({message : "couldn't find that product"})
    } else if (product.provider.toString()!==req.userID && !req.user.admin) {
        res.status(403).json({message : "That's not your product"})
    } else {
        await product.deleteOne()
        res.status(200).json({message : "product updated successfully"})
    }
})
export {addProduct, editProduct, deleteProduct, getProducts, searchProducts, getUserProducts, getProduct}