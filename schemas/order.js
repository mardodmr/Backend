//////////////////order schema//////////////////
const mongoose = require("mongoose");

const Order = mongoose.model(
  "order",
  new mongoose.Schema({
    date: { type: Date, default: Date.now },
    price: { type: Number, min: 0 }, //total
    size: {
      type: String,
    },
    color: {
      type: String,
    },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    quantity: { type: Number, default: 1, max: 100 },
    status: {
      type: String,
      enum: ["pending", "fulfilled"],
      default: "pending",
    },
    paid: { type: Boolean, default: false },
  })
);

module.exports.Order = Order;
