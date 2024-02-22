const mongoose = require("mongoose");
const { User } = require("./user");

//refrence a user document inside a product as the owner

const Product = mongoose.model(
  "product",
  new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    tags: {
      type: Array,
      validate: {
        validator: function (v) {
          v.length > 0;
        },
        message: "A product should have atleast one tag.",
      },
    },
    date: { type: Date, default: Date.now },
    price: { type: Number, required: true, min: 1 },
    isAvailable: { type: Boolean, required: true, default: true },
    additonalNotes: String,
    isClothes: Boolean,
    size: {
      type: String,
      required: function () {
        return this.isClothes;
      },
    },
    color: {
      type: String,
      required: function () {
        return this.isClothes;
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    productImg: { type: String },
  })
);

module.exports.Product = Product;
//because this is a class
