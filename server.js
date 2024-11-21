import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectionDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import productRoute from "./routes/productRoute.js"
import cors from "cors";


// env config
dotenv.config();

// db config
connectionDB();

// rest object
const app = express();

// midellwares
app.use(cors())
app.use(express.json());
app.use(morgan('dev'));

// ROUTES
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/category', categoryRoute);
app.use('/api/v1/product', productRoute)

// respon API
app.get('/', (req,res) => {
    res.send('<h1>Wellcome to BUMDES store</h1>');
})

// PORT 
const PORT = process.env.PORT ||8080;

app.listen(PORT, () => {
    console.log(`Server running on ${process.env.DEV_MODE} mode on port ${PORT}`);
})