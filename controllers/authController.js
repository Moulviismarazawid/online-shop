import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import jwt from "jsonwebtoken";
import orderModel from "../models/orderModel.js";
export const  registerController = async (req,res) => {
    try {
        const {name,email,password,phone,address,answer} = req.body;
        // validation
        if(!name ){
            return res.status(400).send({
                success : false,
                message : "Name is required"
            })
        }
        if(!email){
            return res.status(400).send({
                success : false,
                message : "Email is required"
            })
        }
        if(!password){
            return res.status(400).send({
                success : false,
                message : "Password is required"
            })
        }
        if(!phone){
            return res.status(400).send({
                success : false,
                message : "Phone is required"
            })
        }
        if(!address){
            return res.sendStatus(400).send({
                success : false,
                message : "Email is required"
            })
        }
        if(!answer){
            return res.sendStatus(400).send({
                success : false,
                message : "Answer is required"
            })
        }
        // check
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(200).send({
                success : false,
                message : "User already exists please login",
            })
        }
        const hashedPassword = await hashPassword(password);
        // save
        const user = await new userModel({name,email,phone,address,password:hashedPassword,role:0,answer});
        await user.save();
        res.status(201).send({
            success : true,
            message : "User Register Successfully",
            user
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            message : "Error in Registration",
            error
        })
    }
}

export const loginController = async (req,res) => {
    try {
        const {email,password} = req.body;
        // validation
        if(!email || !password){
            return res.status(404).send({
                success : false,
                message : "Invalid Emali or Password"
            })
        }
        // chechk user
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).send({
                success : false,
                message : "Email is not registered"
            })
        }
        const match = await comparePassword(password,user.password);
        if(!match){
            return res.status(200).send({
                success : false,
                message : "Invalid Password"
            });
        }
        // token
        const token = await jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});
        res.status(200).send({
            sucess : true,
            message : "Login Successfully",
            user : {
                name : user.name,
                email : user.email,
                phone : user.phone,
                address : user.address,
                role : user.role
            },
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            message : "Error in Login",
            error
        })
    }
}

// forgotPasswordController
export const forgotPasswordController = async (req,res) => {
    try {
        const {email, answer, newPassword} = req.body;
        if(!email){
            res.status(400).send({
                success : false,
                message : "Email is required"
            })
        }
        if(!answer){
            res.status(400).send({
                success : false,
                message : "Answer is required"
            })          
        }
        if(!newPassword){          
            res.status(400).send({
                success : false,
                message : "New Password is required"
            })          
        }
        // check
        const user = await userModel.findOne({email,answer});
        if(!user){
            res.status(400).send({
                success : false,
                message : "Wrong Email or Answer"
            })
        }
        // update
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id,{password:hashed});
        res.status(200).send({
            success : true,
            message : "Password Reset Successfully"
        })
    } catch (error) {
        res.status(500).send({
            success : false,
            message : "Error in forgot password",
            error
        })
        console.log(error)
    }
}

// testController
export const testController = (req,res) => {
    res.send("Protected Routes");
}

// update profil controller
export const updateProfileController = async (req,res) => {
    try {
        const {name,email,phone, password, address} = req.body;
        const user = await userModel.findById(req.user._id);
        // password
        if(!password && password.length < 6){
            return res.json({error : "Password is required and must be at least 6 characters long"});
        }
        const hashedPassword =password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id,{
            name : name || user.name,
            email : email || user.email,
            phone : phone || user.phone,
            password : hashedPassword || user.password,
            address : address || user.address
        }, {new : true});
        res.status(200).send({
            success : true,
            message : "Profile Updated Successfully",
            updatedUser
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success : false,
            message : "Error in update profile",
            error
        })
    }
}

// getOrders
export const getOrdersController = async (req,res) => {
    try {
        const orders = await orderModel.find({buyer : req.user._id}).populate('products','-photo').populate('buyer','name');
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success : false,
            message : "Error in get orders",
            error
        })
    }
}