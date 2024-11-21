import mongoose from "mongoose";
import colors from "colors";
const connectionDB = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGO_URL}`);
        console.log(`Database connected ${conn.connection.host}`.bgGreen.white);
    } catch (error) {
        console.log(`Error: ${error}`.bgRed.white);
    }
} 

export default connectionDB;