import express from 'express';
import { config } from "dotenv"
import { connect } from "./services/db.js";
import generalRoutes from "./routes/generalRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import cors from "cors"
import path from "path"
import { errorHandler, notFound } from './middleware/error.js';
import { singleImageMiddleware } from './middleware/contentTypeManagers.js';
config()
const app = express();
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS.split(',') || 'http://localhost:3000'
}));
app.use(express.json())
app.use(singleImageMiddleware)
const PORT = process.env.PORT || 3001;

const __dirname = path.resolve()
app.use("/api/", generalRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)

app.use("/images", express.static(path.join(__dirname, "images")))

app.use(notFound)
app.use(errorHandler)
await connect()
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
