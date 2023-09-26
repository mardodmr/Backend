const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Order } = require("../schemas/order");
const { Product } = require("../schemas/product");

//Orders Backend
//Get the orders of the products I bought.
router.get("/purchased/:status", auth, async (req, res) => {
  const orders = await Order.find({
    buyer: req.user,
    status: req.params.status,
  })
    .sort({ date: -1 })
    .populate("productId", "name _id")
    .populate("owner", "firstName phone cashId")
    .select({
      _id: 1,
      name: 1,
      price: 1,
      date: 1,
      productId: 1,
      quantity: 1,
      //status: 1,
      owner: 1,
    });

  res.send(orders);
});

//Get people's orders of my products.
router.get("/process/:status", auth, async (req, res) => {
  const orders = await Order.find({
    owner: req.user,
    status: req.params.status,
  })
    .sort({ date: -1 })
    .populate("productId", "name")
    .populate("buyer", "firstName lastName phone cashId")
    .select({
      _id: 1,
      name: 1,
      price: 1,
      date: 1,
      productId: 1,
      quantity: 1,
      //status: 1,
      buyer: 1,
      paid: 1,
    });

  res.send(orders);
});

// This might be helful for admin panels (get a single order)
router.get("/:id", (req, res) => {});

//Place (create) an order
router.post("/", auth, async (req, res) => {
  // if the product is not Available and no cash id is provided then return
  const available = await Product.find({
    _id: req.body.productId,
    isAvailavle: true,
  });
  if (!available) return res.status(404).send("This product is out of stock!");
  // a product owner can't place an order on their products (not todo)
  // --> if(owner == currentUser) {can't place an order} front-end

  const ownerId = await Product.find({ productId: req.body.productId })
    .populate("owner", "_id")
    .select({
      owner: 1,
    });

  const order = new Order({
    price: req.body.price,
    size: req.body.size,
    color: req.body.color,
    productId: req.body.productId,
    owner: ownerId, //this shouldn't be passed from the frontend
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
