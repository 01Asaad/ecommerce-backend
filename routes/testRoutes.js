import express from "express"
import { clearDB } from "../controllers/test.js";
const router = express.Router()

router.post("/clearDB", clearDB)

export default router