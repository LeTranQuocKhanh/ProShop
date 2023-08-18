import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample brand",
    category: "Sample category",
    ram: 4,
    ssd: "128GB",
    countInStock: 0,
    numReviews: 0,
    detailName: "Samle detail name",
    techCPU: 'Sample tech CPU',
    speedCPU: 'Sample speed CPU',
    typeRam: 'Sample type ram',
    detailSSD: 'Sample detail SSD',
    screenSize: 'Sample screen size',
    resolution: 'Sample resolution',
    techScreen: 'Sample tech screen',
    graphicCard: 'Sample graphic card',
    techSound: 'Sample tech sound',
    gate: 'Sample gate',
    wireless: 'Sample wireless',
    microSD: 0,
    opticalDrive: 0,
    ledKeyboard: 0,
    os: 'Sample os',
    pinInfomation: 'Sample pin information',
    size: 'Sample size',
    weight: 1,
    material: 'Sample material',
    description: "Sample description",
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name,detailName,techCPU,speedCPU,typeRam,detailSSD,screenSize,resolution,techScreen,graphicCard,techSound,gate,wireless,microSD,opticalDrive,ledKeyboard,os,pinInfomation,size,weight,material, price, ram, ssd, description, image, brand, category, countInStock,  } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.ram = ram;
    product.ssd = ssd;
    product.category = category;
    product.detailName = detailName;
    product.techCPU = techCPU;
    product.speedCPU = speedCPU;
    product.typeRam = typeRam;
    product.detailSSD = detailSSD;
    product.screenSize = screenSize;
    product.resolution = resolution;
    product.techScreen = techScreen;
    product.graphicCard = graphicCard;
    product.techSound = techSound;
    product.gate = gate;
    product.wireless = wireless;
    product.microSD = microSD;
    product.opticalDrive = opticalDrive;
    product.ledKeyboard = ledKeyboard;
    product.pinInfomation = pinInfomation;
    product.size = size;
    product.weight = weight;
    product.material = material;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
};
