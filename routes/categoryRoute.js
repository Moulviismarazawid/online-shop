import express from "express";
import { requireSignin, isAdmin } from './../middlewares/authMiddleware.js';
import { categoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from "../controllers/categoryController.js";

const router = express.Router();

// cretate category
router.post('/create-category',requireSignin, isAdmin, createCategoryController);

//update category
router.put('/update-category/:id',requireSignin, isAdmin, updateCategoryController);

// get All category
router.get('/get-category',categoryController);

// get single category
router.get('/single-category/:slug',singleCategoryController);

// delete category
router.delete('/delete-category/:id',requireSignin, isAdmin, deleteCategoryController);

export default router;