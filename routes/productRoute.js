import express from "express";
import { requireSignin, isAdmin } from './../middlewares/authMiddleware.js'
import { createProductController, deleteProductController, getPhotoProductController, getProductController, getSingleProductController, productCategoryController, productCountController, productFiltersController, productListController, reletedProductController, searchController, updateProductController } from "../controllers/productController.js";
import formidable from "express-formidable";

const router = express.Router();

// create product
router.post('/create-product', requireSignin, isAdmin,formidable() ,createProductController);

// update product
router.put('/update-product/:pid', requireSignin, isAdmin,formidable() ,updateProductController);

// get-product
router.get('/get-product', getProductController);

// get single product
router.get('/get-product/:slug', getSingleProductController);

// get photo
router.get('/product-photo/:pid', getPhotoProductController);

// delete product
router.delete('/delete-product/:pid',  requireSignin, isAdmin, deleteProductController);

// filter product
router.post('/product-filters', productFiltersController);

// product count
router.get('/product-count', productCountController);

// product lis
router.get('/product-list/:page', productListController);

// searh product
router.get('/search/:keyword', searchController);

// releted product
router.get('/releted-product/:pid/:cid', reletedProductController);

// category-product
router.get('/product-category/:slug', productCategoryController);

export default router;