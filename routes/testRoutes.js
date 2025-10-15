import express from "express"
import { clearDB, seedDB } from "../controllers/test.js";
import isDevEnv from "../middleware/is-dev-env.js";

const router = express.Router()

router.post("/clearDB", isDevEnv, clearDB)
router.post("/seedDB", isDevEnv, seedDB)

export default router