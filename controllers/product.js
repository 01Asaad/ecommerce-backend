import Product from "../models/product.js";
import asyncHandler from 'express-async-handler';
import User from "../models/user.js";

const addProduct = asyncHandler(async function addProduct(req, res, next) {
    const similarProduct = await Product.findOne({ name: req.body.name, provider: req.userID })
    if (similarProduct) {
        return res.status(422).json({ message: `you already have a product with the same name, edit that product or simply choose a different name`, productID: similarProduct._id })
    }

    const product = new Product({ name: req.body.name, provider: req.userID, price: req.body.price, stock: req.body.stock, enabled: req.body.enabled, image: req.file ? req.file.path : null })
    const result = await product.save()
    return res.status(201).json({ message: `product created`, productID: result._id, productInfo: product })
})
const editProduct = asyncHandler(async function editProduct(req, res, next) {
    const productID = req.params.productID
    const product = await Product.findById(productID)
    if (!product) {
        return res.status(404).json({ message: "product not found" })
    }
    if (product.provider.toString() !== req.userID && !req.user.admin) {
        return res.status(403).json({ message: "You don't have permission to modify this product" })
    }
    const isProductProviderMe = product.provider._id.equals(req.userID)
    const similarProduct = await Product.findOne({ name: req.body.name, provider: product.provider._id, _id: { $ne: product._id } })
    if (similarProduct) {
        return res.status(422).json({
            message: isProductProviderMe ? `you already have a different product with the same name, edit that product or simply choose a different name` : `supplier already has a different product with the same name, edit that product or simply choose a different name`,
            productID: similarProduct._id
        })
    }

    for (let key of Object.keys(req.body).filter(key => !["provider", "image"].includes(key))) {
        product[key] = req.body[key]
    }
    if (req.file) {
        product.image = req.file.path
    }
    product.modifiedAt = Date.now().toString()
    await product.save()
    res.status(200).json({ message: "product updated successfully", productInfo: product })
})
const getProducts = asyncHandler(async function (req, res, next) {
    let { sortBy = 'createdAt', order = 'asc', limit = 20, keyword = "", exactMatch = "true", page = 0 } = req.query;
    page = parseInt(page)
    limit = Math.min(50, parseInt(limit))
    let sortCriteria = {};
    if (['price', 'createdAt'].includes(sortBy)) {
        sortCriteria[sortBy] = order === 'desc' ? -1 : 1;
    } else {
        sortCriteria = { createdAt: 1 };
    }

    const searchCondition = keyword ? {
        name: exactMatch === "true" ? keyword : { $regex: keyword, $options: 'i' }
    } : {};
    const offset = page * limit

    const totalProducts = await Product.countDocuments({
        enabled: true,
        stock: { $gt: 0 },
        ...searchCondition
    });

    const products = await Product.find({ enabled: true, stock: { $gt: 0 }, ...searchCondition })
        .sort(sortCriteria)
        .skip(offset)
        .limit(limit && !isNaN(limit) && limit > 0 ? parseInt(limit) : 0);

    res.status(200).json({
        products: products.map(product => product.toJSON()),
        pagination: {
            currentPage: page,
            totalItems: totalProducts,
            totalPages: Math.ceil(totalProducts / limit)
        }
    });
});
const getProduct = asyncHandler(async function (req, res, next) {
    let product
    try {
        product = await Product.findById(req.params.productID);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: 'Invalid product ID format',
                receivedId: req.params.productID
            });
        } else {
            error.status = 500
            return next(error)
        }
    }
    if (!product) {
        return res.status(404).json({ message: "product not found" })
    }
    const user = await User.findById(product.provider)
    return res.status(200).json({ ...product.toJSON(), providerName: user?.username });
});
const searchProducts = asyncHandler(async function (req, res, next) {
    const {
        q = '',
        minPrice,
        maxPrice,
        sortBy = 'createdAt',
        order = 'asc',
        page = 1,
        limit = 10
    } = req.query;

    const searchQuery = {
        enabled: true,
        stock: { $gt: 0 }
    };

    if (q) {
        searchQuery.$text = { $search: q };
    }

    if (minPrice || maxPrice) {
        searchQuery.price = {};
        if (minPrice) searchQuery.price.$gte = Number(minPrice);
        if (maxPrice) searchQuery.price.$lte = Number(maxPrice);
    }

    let sortCriteria = {};
    if (['price', 'createdAt', 'name'].includes(sortBy)) {
        sortCriteria[sortBy] = order === 'desc' ? -1 : 1;
    } else {
        sortCriteria = { createdAt: 1 };
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(searchQuery)
        .sort(sortCriteria)
        .skip(skip)
        .limit(Number(limit));

    const total = await Product.countDocuments(searchQuery);

    res.status(200).json({
        products: products.map(product => product.toJSON()),
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / limit)
        }
    });
});
const getUserProducts = asyncHandler(async function (req, res, next) {
    const { sortBy = 'createdAt', order = 'asc' } = req.query;
    const userID = req.params.userID
    let sortCriteria = {};
    if (['price', 'createdAt'].includes(sortBy)) {
        sortCriteria[sortBy] = order === 'desc' ? -1 : 1;
    } else {
        sortCriteria = { createdAt: 1 };
    }
    const products = await Product.find({ enabled: true, provider: userID }).sort(sortCriteria);
    res.status(200).json(products.map(product => product.toJSON()));
})
const deleteProduct = asyncHandler(async function deleteProduct(req, res, next) {
    const productID = req.params.productID
    const product = await Product.findById(productID)
    if (!product) {
        res.status(404).json({ message: "Product not found." })
    } else if (product.provider.toString() !== req.userID && !req.user.admin) {
        res.status(403).json({ message: "You don't have permission to modify this product." })
    } else {
        await product.deleteOne()
        res.status(200).json({ message: "product deleted successfully." })
    }
})
export { addProduct, editProduct, deleteProduct, getProducts, searchProducts, getUserProducts, getProduct }