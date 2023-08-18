import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
});

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    detailName: {
      type: String,
    },
    techCPU: {
      type: String,
    },
    speedCPU: {
      type: String,
    },
    typeRam: {
      type: String,
    },
    detailSSD: {
      type: String,
    },
    screenSize: {
      type: String,
    },
    resolution: {
      type: String,
    },
    techScreen: {
      type: String,
    },
    graphicCard: {
      type: String,
    },
    techSound: {
      type: String,
    },    
    gate: {
      type: String,
    },
    
    wireless: {
      type: String,
    },

    microSD: {
      type: Number,
    },
    opticalDrive: {
      type: Number,
    },

    ledKeyboard: {
      type: Number,
    },

    os: {
      type: String,
    },
    pinInfomation: {
      type: String,
    },


    size: {
      type: String,
    },

    weight: {
      type: Number,
    },

    
    material: {
      type: String,
    },
    

    image: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ram: {
      type: Number,
      required: true,
    },
    ssd: {
      type: String,
      required: true,
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
