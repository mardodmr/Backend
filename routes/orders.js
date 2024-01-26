const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Order } = require("../schemas/order");
const { Product } = require("../schemas/product");

//Orders Backend
//Get the orders of the products I bought.
router.get("/purchased/:status", auth, async (req, res) => {
  const orders = await Order.find({
    buyer: req.user._id,
    status: req.params.status,
  })
    .sort({ date: -1 })
    .populate("productId", "name _id")
    .populate("owner", "firstName lastName phone cashId")
    .populate("buyer", "firstName lastName phone cashId")
    .select({
      _id: 1,
      price: 1,
      size: 1,
      color: 1,
      buyer: 1,
      date: 1,
      productId: 1,
      quantity: 1,
      //status: 1,
      owner: 1,
    });

  if (!orders.length) return res.status(404).send("No orders found!");
  res.send(orders);
});

//Get people's orders of my products.
router.get("/process/:status", auth, async (req, res) => {
  const orders = await Order.find({
    owner: req.user._id,
    status: req.params.status,
  })
    .sort({ date: -1 })
    .populate("productId", "name")
    .populate("buyer", "firstName lastName phone cashId")
    .populate("owner", "firstName lastName phone cashId")
    .select({
      _id: 1,
      price: 1,
      size: 1,
      color: 1,
      buyer: 1,
      date: 1,
      productId: 1,
      quantity: 1,
      //status: 1,
      owner: 1,
    });
  if (!orders.length) return res.status(404).send("No orders found!");

  res.send(orders);
});

// This might be helful for admin panels (get a single order)
router.get("/:id", (req, res) => {});

//Place (create) an order
router.post("/", auth, async (req, res) => {
  const available = await Product.find({
    _id: req.body._id,
    isAvailavle: true,
  });

  if (!available) return res.status(404).send("This product is out of stock!");

  const ownerId = await Product.find({ _id: req.body._id })
    .populate("owner")
    .select({
      _id: -1,
      owner: 1,
    });

  const order = new Order({
    price: req.body.price,
    size: req.body.size,
    color: req.body.color,
    productId: req.body._id,
    owner: ownerId[0].owner._id, //this shouldn't be passed from the frontend
    buyer: req.user,
    quantity: req.body.quantity,
  });
  const result = await order.save();
  res.send(result);
});

// Update an order --> paid: true
router.put("/paid/:id", auth, async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, {
    $set: {
      paid: true,
    },
  });
  res.send(order);
});

//Update an order --> status: fulfilled / pending
router.put("/status/:id", auth, async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, {
    $set: {
      status: "fulfilled",
    },
  });
  res.send(order);
});

//Still no clear plan for canceling orders
router.delete("/:id", (req, res) => {
  //Lookup the course
  //If not existing, return 404

  //Delete

  //Return the same product

  res.send();
});

module.exports = router;
