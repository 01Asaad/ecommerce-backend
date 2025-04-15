import Order from "../models/order.js"
import fs from "fs"
import path from "path"
import asyncHandler from 'express-async-handler';
import Cart from "../models/cart.js"
import { validateCartIsPurchasble, calculateCartPrice } from "../services/validateCart.js"
import Transaction from "../models/transaction.js"
import pdfDocument from "pdfkit"

const getOrders = asyncHandler(async function(req, res, next) {
    const orders = await Order.find({creator : req.userID})
    res.status(200).json(orders.map(order => order.toJSON()))
})
const createOrder = asyncHandler(async function(req, res, next) {
    const cart = await Cart.findById(req.body.cartID)
    if (!cart || cart.creator.toString()!==req.userID.toString()) {
        return res.status(422).json({message : "Cart does not exist or is not yours"})
    }
    const cartValidation = await validateCartIsPurchasble(cart)
    if (!cartValidation.status) {
        return res.status(422).json(cartValidation.message)
    }
    const paymentExpected = await calculateCartPrice(cart)
    if (req.body.paymentMethod === "balance") {
        if (req.user.balance < paymentExpected) {
            return res.status(422).json({message : "Insufficient balance"})
        }
    } 
    
    
    const transaction = new Transaction({creator : req.userID, type : "income", "method" : req.body.paymentMethod})
    if (req.body.paymentMethod === "balance") {
        req.user.balance-=paymentExpected
        await req.user.save()
    }
    await transaction.save()
    const order = new Order({creator : req.userID, products : (await cart.populate({path : "products.product", model : "Product", select : "_id price"})).products, transaction : transaction._id})
    cart.deleteOne()
    await order.save()
    res.status(201).json({message : "order created successfully", orderID : order._id})
})
const requestRefund = asyncHandler(async function requestRefund(req, res, next) {
    const order = await Order.findOne({_id : req.params.orderID, creator : req.userID })
    if (!order) {
        res.status(422).json({message : "Order does not exist or is not yours"})
    }
    if (order.status!=="success") {
        res.status(422).json({message : "Order can't be refunded"})
    }
    order.status = "pending refund"
    await order.save()
    res.status(200).json({message : "request success"})
})
const getInvoice = asyncHandler(async function getInvoice(req, res, next) {
    const order = await Order.findById(req.params.orderID)
    if (!order) {
        res.status(404).json({message : "order doesn't exist"})
    }
    else if (order.creator.toString() !== req.userID){
        res.status(403).json({message : "Order isn't yours"})
    }
    
    else {
        const invoiceName = `invoice-${req.params.orderID}.pdf`
        const invoicePath = path.join("data", "invoices", invoiceName)
        res.setHeader("Content-Type", "application/pdf")
        res.setHeader("Content-Disposition", `attachment;filename="${invoiceName}"`)
        if (!fs.existsSync(invoicePath)) {
            const pdfDoc = new pdfDocument()
            pdfDoc.pipe(fs.createWriteStream(invoicePath))
            pdfDoc.pipe(res)
            pdfDoc.fontSize(26).text("Invoice", {underline : true})
            pdfDoc.text("-----------------------")
            
            for (let product of (await order.populate({path : "products.product._id", select : "name"})).products) {
                pdfDoc.text(`${product.quantity} x ${product.product._id.name} = ${product.product.price*product.quantity}`)
            }
            pdfDoc.end()
        } else {
            const file = fs.createReadStream(invoicePath)
            file.pipe(res)
        }
    }
})
export {createOrder, requestRefund, getOrders, getInvoice}