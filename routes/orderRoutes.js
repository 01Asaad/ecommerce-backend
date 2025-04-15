import express from "express"
import { createCart, getLatestCart } from "../controllers/cart.js";
import { createOrder, getInvoice, getOrders, requestRefund } from "../controllers/order.js";
import isAuth from "../middleware/is-auth.js";
const router = express.Router()
router.post("/create-cart", isAuth, createCart)
router.post("/get-cart", isAuth, getLatestCart)
router.post("/create-order", isAuth, createOrder)
router.get("/get-orders", isAuth, getOrders)
router.post("/request-refund/:orderID", isAuth, requestRefund)
router.get("/get-invoice/:orderID", isAuth, getInvoice)
export default router