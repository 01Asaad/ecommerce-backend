import path from "path"
import Product from "../models/product.js"

async function validateCartIsPurchasble(cart) {
    const productIDs = cart.products.map(product => product.product)
    const products = await Product.find({_id : {$in : productIDs}, enabled : true})
    if (productIDs.length !== products.length) {return {status : false, message : "one or more products don't exist or are unpurchaseable"}}

    for (let i=0;i<productIDs.length;i++) {
        const requestedProduct = products[i]
        const product = products[i]

        if (product.stock<requestedProduct.quantity) {
            return {status : false, message : `only ${product.stock} exists of ${product.name}; requested ${requestedProduct.quantity}`}
        }
    }
    return {status : true}
}
async function calculateCartPrice(cart) {
    let total = 0
    for (let product of (await cart.populate({path : "products.product", select : "price"})).products) {
        if (!product ) {
            throw new Error("product doesn't exist")
        }
        total+=product.product.price*product.quantity
    }
    return total
}
export {validateCartIsPurchasble, calculateCartPrice}