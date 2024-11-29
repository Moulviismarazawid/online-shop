import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import midtransClient from "midtrans-client";
import userModel from "../models/userModel.js";
import dotenv  from "dotenv";
dotenv.config()

let Snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export const createOrderController = async (req, res) => {
    try {
        const { userId, itemsDetail, total } = req.body;

        // Validate input
        if (!userId || !itemsDetail || !total) {
            return res.status(400).send({ 
                success: false, 
                message: "User , itemsDetail, and total are required." 
            });
        }
         for (let item of itemsDetail) {
            if (!item.product || !item.name || !item.price || !item.quantity || !item.category) {
                return res.status(400).send({
                    success: false,
                    message: "All fields in itemsDetail are required."
                });
            }
        }

        // Create the order
        const order = await orderModel.create({
            total,
            userId: userId,
            itemsDetail: itemsDetail.map(item => ({
                product: item.product,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                category: item.category,
                orderStatus: "pending",
                paymentStatus: "pending",
            })),
        });

        // Prepare parameters for Midtrans
        let parameter = {
            "transaction_details": {
                "order_id": order._id.toString(),
                "gross_amount": total,
            },
            "item_details": order.itemsDetail.map(item => ({
                id: item.product.toString(),
                price: item.price,
                quantity: item.quantity,
                name: item.name,
            })),
        };

        // Create transaction with Midtrans
        const token = await Snap.createTransaction(parameter);
        res.status(201).send({
            success: true,
            message: "Order Created Successfully",
            order,
            token,
        });
    } catch (error) {
        console.error("Midtrans API Error: ", error); // Log the error for debugging
        res.status(500).send({
            success: false,
            message: "Error in create order",
            error: error.message,
        });
    }
};


export const allOrderController = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.status(200).send({
            success: true,
            message: "All Order",
            orders
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in all order",
            error
        })
    }
}

export const detailOrderController = async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.id);
        res.status(200).send({
            success: true,
            message: "Order Details",
            order
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in detail order",
            error
        })
    }
}

export const currentUserOrderController = async (req, res) => {
    try {
        const orders = await orderModel.find({user: req.user._id}).populate("itemsDetail.product");
        res.status(200).send({
            success: true,
            orders
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in current user order",
            error
        })
    }
}  