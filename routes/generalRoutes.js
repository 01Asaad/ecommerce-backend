import express from "express"
import { getNotifications, clearNotifications, markAsRead } from "../controllers/user.js";
import isAuth from "../middleware/is-auth.js";
const router = express.Router()

router.get("/get-notifications", isAuth, getNotifications)
router.post("/clear-notifications", isAuth, clearNotifications)
router.post("/notifs-mark-as-read", isAuth, markAsRead)

export default router