import express from "express";
import { requireSignin, isAdmin } from "../middlewares/authMiddleware.js";
import { createOrderController, allOrderController, currentUserOrderController, detailOrderController, } from "../controllers/orderController.js";

const router = express.Router();

// create order
router.post('/create-order', requireSignin, createOrderController);

// get all order
router.get('/all-order', requireSignin, isAdmin, allOrderController);

// get current user order
router.get('/current-user-order', requireSignin, currentUserOrderController);

// get order detail
router.get('/order-detail/:id', requireSignin, detailOrderController);

export default router;