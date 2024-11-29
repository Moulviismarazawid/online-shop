import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    total: {
        type: Number,
        required: true,
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "users ",
        required: true,
    },
    itemsDetail: [
        {
            product: {
                type: mongoose.Schema.ObjectId,
                ref: "Product",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            category: {
                type: mongoose.Schema.ObjectId,
                ref: "Category",
                required: true,
            },
            orderStatus: {
                type: String,
                default: "pending",
                enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
            },
            paymentStatus: {
                type: String,
                default: "pending",
                enum: ["pending", "success", "failed"],
            },
        },
    ],
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);