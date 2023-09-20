const { Product } = require("../schemas/product");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); //this middleware helps me protect handlers selectively
const { User } = require("../schemas/user");

//Products Backend

//get products based on category (pagination)
router.get("/tags/:tag", async (req, res) => {
  const products = await Product.find({ tags: req.params.tag })
    .sort({ date: -1 })
    .select({
      name: 1,
      description: 1,
      tags: 1,
      price: 1,
      isAvailable: 1,
      size: 1,
      color: 1,
    });
  console.log(products);
  //pagination
  if (!products.length)
    return res.status(404).send("Product with this tag is not existing...");
  res.send(products);
});

//get all products (pagination)
router.get("/", async (req, res) => {
  const products = await Product.find()
    .populate("owner", "firstname lastname") //query a refrenced document
    .sort({ date: -1 })
    .select(
      {
        name: 1,
        description: 1,
        tags: 1,
        price: 1,
        isAvailable: 1,
        size: 1,
        color: 1,
        owner: 1,
      } /*return the properties to the user*/
    ); //pagination
  res.send(products);
  if (!products) return res.status(404);
  console.log(products);
});

//Get a product with a given id // this is helpful when a user wants to update a product so they look it up first
router.get("/id/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product)
    return res.status(404).send("The product with the given ID is not found.");
  res.send(product);
});

//Create
router.post("/", auth, async (req, res) => {
  //cezar's approach destructuring
  const product = new Product({
    //this is a Product object
    name: req.body.name,
    description: req.body.description,
    tags: req.body.tags,
    price: req.body.price,
    isAvailable: req.body.isAvailable,
    isClothes: req.body.isClothes,
    color: req.body.color,
    size: req.body.size,
    owner: req.user,
  });
  const result = await product.save();

  //increment user's number of products by one +1
  await User.findByIdAndUpdate(req.user, {
    $inc: { numberOfProducts: 1 },
  });

  res.send(result);
});

//Update
router.put("/:id", auth, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, {
    $set: {
      name: req.body.name,
      description: req.body.description,
      tags: req.body.tags,
      price: req.body.price,
      isAvailable: req.body.isAvailable,
      isClothes: req.body.isClothes,
      color: req.body.color,
      size: req.body.size,
    }, //the update object
  });

  if (!product)
    return res.status(404).send("The product with the given ID is not found");
  //Lookup the products
  //If not existing, return 404 (recourse not found)

  //Validate the product
  //If invalid, return 400 - Bad request

  //Update the product
  //Return the updated product
  res.send(product);
});

router.delete("/:id", auth, async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id);
  if (!product)
    return res.status(404).send("The product with the given ID is not found");
  //Lookup the course
  //If not existing, return 404

  //Delete

  //Return the same product

  res.send(product);
});

module.exports = router;
