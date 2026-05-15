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
    } = req.body;


    const product = new Product({
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
      user: req.user._id,
    });
    const createdProduct = await product.save();
  return  res.status(201).json(createdProduct);
  } catch (error) {
  return  res
      .status(500)
      .send({ message: " duplicate product can not not be added" });
  }
});

// put req for update product api/product/:id
// desc update in existing product
// access by only admin/private

router.put("/:id", protect, admin, async (req, res) => {
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
    } = req.body;
    // Find  product  by id

    const product = await Product.findById(req.params.id);
    if (product) {
      ((product.name = name || product.name),
        (product.description = description || product.description),
        (product.price = price || product.price),
        (product.discountedPrice = discountedPrice || product.discountedPrice),
        (product.countInStock = countInStock || product.countInStock),
        (product.category = category || product.category),
        (product.brand = brand || product.brand),
        (product.sizes = sizes || product.sizes),
        (product.colors = colors || product.colors),
        (product.collection = collection || product.collection),
        (product.materials = material || product.materials),
        (product.gender = gender || product.gender),
        (product.images = images || product.images),
        (product.isFeatured =
          isFeatured !== undefined ? isFeatured : product.isFeatured),
        (product.isPublished =
          isPublished !== undefined ? isFeatured : product.isPublished),
        (product.tags = tags || product.tags),
        (product.dimesions = dimensions || product.dimensions),
        (product.weight = weight || product.weight),
        (product.sku = sku || product.sku));

      const updateProduct = await product.save();
    return  res.json(updateProduct);
    } else {
    return  res.status(404).json({ message: "product not found" });
    }
  } catch (error) {
    console.log(error);
  return  res.status(500).send({ message: "server error" });
  }
});

router.delete("/:id", protect, admin, async (req, res) => {
  const product = await Product.findById(req.params.id);
  try {
    if (product) {
      await product.deleteOne();
     return res.status(200).json({ message: "product deleted" });
    } else {
      console.log("error in  delete route");
    return  res.status(404).json({ message: "Product Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({message:"server error"})
  }
});


// route  for get/api/products
// desc get all product with optional query filter
// access  public

router.get("/", async (req, res) => {
  try {
    const {
      collections,
      size,
      colors,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit,
    } = req.query;

    let query = {};

    // filter logic
    if (collections && collections.toLocaleLowerCase() !== "all") {
      query.collections = { $regex: collections, $options: "i" };
    }
    if (category && category.toLocaleLowerCase() !== "all") {
      query.category = { $regex: category, $options: "i" };
    }
    if (material) {
      query.material = { $in: material.split(",") };
    }
    if (size) {
      query.sizes = { $in: size.split(",") };
    }
    if (brand) {
      query.brand = { $in: brand.split(",") };
    }
    if (colors) {
      query.colors = { $in: [colors] };
    }
    if (gender) {
      query.gender = { $regex: gender, $options: "i" };
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // sort logic

    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
          sort = { price: 1 };
          break;
        case "priceDesc":
          sort = {
            price: -1,
          };
          break;
        case "popularity":
          sort = { rating: -1 };
          break;
        default:
          break;
      }
    }

    // fetch product and apply sirting and limit
    let products = await Product.find(query)
      .sort(sort)
      .limit(Number(limit) || 0);

  return  res.json(products);
  } catch (error) {
    console.log(error);
   return res.status(500).json({ message: "internal server error" });
  }
});


// get/api/product/best-seeler
// retrive the best product with high rating
// access public

router.get("/best-seller",async (req,res)=>{
  try {
    const bestSeller=await Product.find().sort({rating:-1}).limit(4)
    if(bestSeller){
      res.json(bestSeller)
    }else{
      res.status(404).json({message:"best seller not found"})
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"server error"})
  }
})

// route get/api/products/newarrivals
// send the latest product enter in data base


router.get("/new-arrivals",async(req,res)=>{
      try {
          const newarrivals= Product.find().sort({createdAt:-1}).limit(8)
          res.json(newarrivals)
      } catch (error) {
        console.log(error)
        res.status(500).json({message:"Server Error"})
      }
})

// get/api/product/:id
// get a selected id
// access public

router.get("/:id", async (req, res) => {
  try {

    const product= await Product.findById(req.params.id)
    if(product){
    return  res.json(product)
    } else{
    return  res.status(404).json({message:"Product not found"})
    }
  } catch (error) {
    console.log(error)
   return res.status(500).send("Server Error")

  }

});


// similar product api
// api/product/aimilar /id
//  retriver similar product based on current product gender and category

router.get("/similar/:id",async (req,res)=>{
  const {id}=req.params;
  try {
    const product = await Product.findById(id)

    if(!product){
    return  res.status(404).json({message:"Product not found"})
    }
    const similarProduct = await Product.find({
      _id:{$ne:id}, // orignal product will be not send
      gender:product.gender,
      category:product.category,

    }).limit(4)

   return   res.json(similarProduct)

  } catch (error) {
    console.log(error)
    return res.status(500).json({message:"server error"})
  }
  
})




module.exports = router;
