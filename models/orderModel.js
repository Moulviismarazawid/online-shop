import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    products : [
        {
            type : mongoose.ObjectId,
            ref : 'Product'
        }
    ],
    paymen : {},
    buyer : {
        type : mongoose.ObjectId,
        ref : 'users'
    },
    status : {
        type : String,
        default: "Not Process",
        enum : ['Not Process','Procesing', 'shipped', 'delivered','cencel'],
    }
},{timestamps : true})

export default mongoose.model('Order', orderSchema);