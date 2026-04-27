import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// ================= ADD PRODUCT =================
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestSeller,
    } = req.body;

    // ✅ Validation
    if (!name || !description || !price || !category || !subCategory || !sizes) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    if (isNaN(price)) {
      return res.status(400).json({
        success: false,
        message: "Price must be a number",
      });
    }

    // ✅ Images
    const imageFiles = [
      req.files?.image1?.[0],
      req.files?.image2?.[0],
      req.files?.image3?.[0],
      req.files?.image4?.[0],
    ].filter(Boolean);

    if (imageFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image required",
      });
    }

    // ✅ Upload images
    const imagesUrl = await Promise.all(
      imageFiles.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    // ✅ Parse sizes
    let parsedSizes;
    try {
      parsedSizes = Array.isArray(sizes) ? sizes : JSON.parse(sizes);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid sizes format",
      });
    }

    // ✅ Save product
    const product = await productModel.create({
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestSeller: bestSeller === "true",
      sizes: parsedSizes,
      image: imagesUrl,
      date: Date.now(),
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });

  } catch (error) {
    console.log("Add Product Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= LIST PRODUCTS =================
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({}).sort({ date: -1 });

    res.json({ success: true, products });

  } catch (error) {
    console.log("List Products Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= REMOVE PRODUCT =================
const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ✅ OPTIONAL: delete images from Cloudinary
    // (only if you stored public_id separately)

    await productModel.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Product removed successfully",
    });

  } catch (error) {
    console.log("Remove Product Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= SINGLE PRODUCT =================
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.params; // ✅ FIXED

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({ success: true, product });

  } catch (error) {
    console.log("Single Product Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addProduct, listProducts, removeProduct, singleProduct };