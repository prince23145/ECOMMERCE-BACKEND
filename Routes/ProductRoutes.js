const express = require("express");
const Product = require("../Models/Products.js");
const { protect, admin } = require("../Middelware/authMiddelware.js");
const mongoose = require("mongoose");
const { route } = require("./ProductRoutes.js");

const router = express.Router();

router.post("/", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountedPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collection,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      rating,
      sku,
    }= req.body
    const product=
 new Product({
      name,
      description,
      price,
      discountedPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collection,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
      rating,
      user:req.user._id
    })
    const createdProduct= await product.save();
    res.status(201).json(createdProduct)


  } catch (error) {
    res.status(500).send({message:" duplicate product can not not be added"})
  }
});


// put req for update product api/product/:id
// desc update in existing product
// access by only admin/private

router.put("/:id",protect,admin, async (req,res)=>{
    try {
    
        const {
      name,
      description,
      price,
      discountedPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collection,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      rating,
      sku,
    }= req.body
    // Find  product  by id
    
    const product=await Product.findById(req.params.id)
        if(product){
            product.name=name ||product.name,
            product.description=description ||product.description,
            product.price=price ||product.price,
            product.discountedPrice= discountedPrice||product.discountedPrice,
            product.countInStock=countInStock ||product.countInStock,
            product.category=category ||product.category,
            product.brand=brand ||product.brand,
            product.sizes=sizes ||product.sizes,
            product.colors=colors ||product.colors,
            product.collection=collection ||product.collection,
            product.materials=material ||product.materials,
            product.gender=gender ||product.gender,
            product.images=images ||product.images,
            product.isFeatured= isFeatured  !==undefined ? isFeatured : product.isFeatured,
            product.isPublished= isPublished !==undefined ? isFeatured : product.isPublished,
            product.tags=tags ||product.tags,
            product.dimesions=dimensions ||product.dimensions,
            product.weight=weight ||product.weight,
            product.sku =sku ||product.sku
        
          const updateProduct=await product.save()
        res.json(updateProduct)

        }
        else{
            res.status(404).json({message:"product not found"})
        }


    } catch (error) {
        console.log(error)
        res.status(500).send({message:"server error"}) 
    }
})

router.delete("/:id",protect,admin,async(req,res)=>{
   const product=await Product.findById(req.params.id)
   try {
 
      if(product){
         await product.deleteOne()
         res.status(200).json({message:"product deleted"})
      }
      else{
         console.log("error in  delete route")
         res.status(404).json({message:"Product Not Found"})
      }
   } catch (error) {
    console.log(error)
   }
})

router.get("/:id",protect,async(req,res)=>{
    
})

//  route for GET api/products
//  get all products with optional query filter
// access public

router.get("/",async(req,res)=>{
   
})

module.exports=router