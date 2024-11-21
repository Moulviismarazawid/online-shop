import express from "express";
import { forgotPasswordController, getOrdersController, loginController, registerController, testController, updateProfileController,} from "../controllers/authController.js";
import { isAdmin, requireSignin } from "../middlewares/authMiddleware.js";

// router object
const router = express.Router();

// register
router.post('/register',registerController);
// login
router.post('/login',loginController);
// test
router.get('/test',requireSignin,isAdmin ,testController);
// protected route
router.get('/user-auth',requireSignin,(req,res) => res.status(200).send({ok:true}));
// admin route
router.get('/admin-auth',requireSignin,isAdmin,(req,res) => res.status(200).send({ok:true}));

// forgot password
router.post('/forgot-password',forgotPasswordController);

// upate profile
router.put('/update-profile',requireSignin,updateProfileController);

// getOrders
router.get('/orders',requireSignin, getOrdersController);

export default router;