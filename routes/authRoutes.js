import express from "express"
import { signup, login, deleteUser, changePassword, getUser } from "../controllers/user.js";
import isAuth from "../middleware/is-auth.js";
import { loginLimiter } from "../middleware/rateLimit.js";
const router = express.Router()

router.post("/login", loginLimiter, login)
router.post("/signup", signup)
router.get("/user", isAuth, getUser)
router.delete("/delete", isAuth, deleteUser)
router.post("/change-password", isAuth, changePassword)

export default router