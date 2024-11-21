import slugify from "slugify";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js"
import fs from 'fs';

export const createProductController = async (req, res) => {
    try {
        const {name,slug,description,price,quantity,category,shipping} = req.fields;
        const {photo} = req.files;
        switch(true){
            case !name:
                return res.status(500).send({error: "Name is required"})
            case !description:
                return res.status(500).send({error: "Description is required"})
            case !price:
                return res.status(500).send({error: "Price is required"})
            case !quantity:
                return res.status(500).send({error: "Quantity is required"})
            case !category:
                return res.status(500).send({error: "Category is required"})
            case photo && photo.size > 100000:
                return res.status(500).send({error: "Photo is required and should be less then 1MB"})
        }
        const products = await productModel({...req.fields, slug:slugify(name)})
        if(photo){
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save()
        res.status(201).send({
            success: true,
            message: "Create Product Successfully",
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            error,
            message : "Error in Upload Product",
        })
    }
}

// get-Product
export const getProductController = async (req, res) => {
    try {
        const products = await productModel.find({}).populate("category").select("-photo").limit(12).sort({createdAt: -1})
        res.status(200).send({
            success: true,
            countTotal : products.length,
            message : "Get Product Successfully",
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            error,
            message : "Error in get Product"   
        })
    }
}

// get single product

export const getSingleProductController = async (req, res) => {
    try {
        const product  = await productModel.findOne({slug: req.params.slug}).select("-photo").populate("category");
        res.status(200).send({
            success : true,
            message : "Single Product Fetched",
            product
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            succes: false,
            error,
            message : "Erorr in get single product"
        })
    }
}

// get photo
export const getPhotoProductController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo");
        if(product.photo.data){
            res.set("Content-type", product.photo.contentType);
            res.status(200).send(product.photo.data);
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message : "Error in get Product photo"
        })
    }
}

// delete product
export const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({
            succes : true,
            message : "Delete Product Successfully",
        })
    } catch (error) {
        console.log(error)
        res.status(5000).send({
            success:false,
            error,
            message : "Error in delete Product"
        })
    }
}

// update product
export const updateProductController = async (req, res) => {
     try {
        const {name,slug,description,price,quantity,category,shipping} = req.fields;
        const {photo} = req.files;
        switch(true){
            case !name:
                return res.status(500).send({error: "Name is required"})
            case !description:
                return res.status(500).send({error: "Description is required"})
            case !price:
                return res.status(500).send({error: "Price is required"})
            case !quantity:
                return res.status(500).send({error: "Quantity is required"})
            case !category:
                return res.status(500).send({error: "Category is required"})
            case photo && photo.size > 100000:
                return res.status(500).send({error: "Photo is required and should be less then 1MB"})
        }
        const products = await productModel.findByIdAndUpdate(req.params.pid, {...req.fields, slug:slugify(name)},{new : true})
        if(photo){
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save()
        res.status(201).send({
            success: true,
            message: "Update Product Successfully",
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            error,
            message : "Error in Update Product",
        })
    }
}

// filter controller
export const productFiltersController = async (req, res) => {
    try {
        const {checked ,radio} = req.body;
        let args = {};
        if(checked.length > 0) args.category = checked;
        if(radio.length) args.price = {$gte: radio[0], $lte : radio[1]};
        const products = await productModel.find(args)
        res.status(200).send({
            succes : true,
            message: "Filter Product Successfully",
            products
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            succes : false,
            message : "Error in Filter Product",
            error
        })
    }
}

// product count
export const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            succes : true,
            total
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success : false,
            message : "Error in product count",
            error
        })
    }
}

// product list
export const productListController = async (req, res) => {
    try {
        const perPage = 6 ;
        const page = req.params.page ? req.params.page : 1 ;
        const products = await productModel.find({}).select("-photo").skip((page-1) * perPage).limit(perPage).sort({createdAt : -1});
        res.status(200).send({
            succes : true,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            succes : false,
            message : "Error List Controller",
            error
        })
    }
}

// searh controller
export const searchController = async (req, res) => {
    try {
        const {keyword} = req.params ;
        const result = await productModel.find({
            $or : [
                {name : {$regex : keyword, $options : 'i'}},
                {description : {$regex : keyword, $options : 'i'}}
            ]
        }).select("-photo");
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success : false,
            message : "Error in Search Controller",
            error
        })
    }
}

// similar product
export const reletedProductController = async (req, res) => {
    try {
        const {pid,cid} = req.params ;
        const products = await productModel.find({_id : {$ne : pid}, category : cid}).select("-photo").limit(3).populate("category");
        res.status(200).send({
            success : true,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success : false,
            message : "Error in Related Product Controller",
            error
        })
    }
}

// Category Product

export const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({slug: req.params.slug});
        const product = await productModel.find({category}).populate("category");
        res.status(200).send({
            success: true,
            category,
            product
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success : false,
            message: "Error in Category Product",
            error
        })
    }
}