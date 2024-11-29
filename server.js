import express, { urlencoded } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectionDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import productRoute from "./routes/productRoute.js"
import orderRoute from "./routes/orderRoute.js"
import cors from "cors";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";

// env config
dotenv.config();

// db config
connectionDB();

// rest object
const app = express();

// midellwares
app.use(express.json());
app.use(helmet());
app.use(ExpressMongoSanitize());
app.use(cors({
    origin: 'http://localhost:3000', // Ganti dengan URL frontend Anda
    methods: ['GET', 'POST'],
    credentials: true // Jika Anda menggunakan cookie
}))
app.use(urlencoded({extended: true}))
app.use(morgan('dev'));

// ROUTES
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/category', categoryRoute);
app.use('/api/v1/product', productRoute)
app.use('/api/v1/orders', orderRoute)


// PORT 
const PORT = process.env.PORT ||8080;

app.listen(PORT, () => {
    console.log(`Server running on ${process.env.DEV_MODE} mode on port ${PORT}`);
})