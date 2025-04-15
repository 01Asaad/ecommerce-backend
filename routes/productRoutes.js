import express from "express"
import isAuth from "../middleware/is-auth.js"
import { addProduct, editProduct, deleteProduct, getProducts, searchProducts, getUserProducts, getProduct } from "../controllers/product.js"
const router = express.Router()
router.get("/get-products/:userID", getUserProducts)
router.get("/get-product/:productID", getProduct)
router.get("/get-products", getProducts)
router.get("/search-products", searchProducts)
router.post("/add-product", isAuth, addProduct)
router.post("/add-product", isAuth, addProduct)
router.post("/edit-product", isAuth, editProduct)
router.post("/delete-product/:productID", isAuth, deleteProduct)
export default router