const { Product } = require("../schemas/product");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); //this middleware helps me protect handlers selectively
const { User } = require("../schemas/user");

//Products Backend

//Search products by name
router.get("/search/:searchWord", async (req, res) => {
  const page = req.query.page || 0;
  const productsPerPage = 10;

  const pattern = new RegExp(`.*${req.params.searchWord}.*$`, "i");

  const products = await Product.find({
    name: { $regex: pattern },
  })
    .populate("owner", "firstName lastName userType")
    .sort({ date: -1 })
    // .skip(page * productsPerPage)
    // .limit(productsPerPage)
    .select({
      name: 1,
      description: 1,
      tags: 1,
      price: 1,
      isAvailable: 1,
      size: 1,
      color: 1,
      owner: 1,
      productImg: 1,
    });
  // console.log(products);
  //pagination
  if (!products.length)
    return res.status(404).send("No products found with this name...");
  res.send(products);
});

//Get all products that I own (my products)
router.get("/myproducts", auth, async (req, res) => {
  const products = await Product.find()
    .populate("owner", "_id")
    .sort({ date: 1 })
    .select({
      name: 1,
      description: 1,
      tags: 1,
      date: 1,
      price: 1,
      isAvailable: 1,
      isClothes: 1,
      size: 1,
      color: 1,
      owner: 1,
      productImg: 1,
    });

  const filtered = products.filter((product) => {
    return product.owner._id.equals(req.user._id);
  });
  res.send(filtered);
});

//get products based on category (pagination)
router.get("/tags/:tag", async (req, res) => {
  const page = req.query.page || 0;
  const productsPerPage = 10;

  const products = await Product.find({ tags: req.params.tag })
    .populate("owner", "firstName lastName userType")
    .sort({ date: -1 })
    // .skip(page * productsPerPage)
    // .limit(productsPerPage)
    .select({
      name: 1,
      description: 1,
      tags: 1,
      price: 1,
      isAvailable: 1,
      size: 1,
      color: 1,
      owner: 1,
      productImg: 1,
    });
  // console.log(products);
  //pagination
  if (!products.length)
    return res.status(404).send("No products found with this category...");
  res.send(products);
});

//get products based on user type (pagination)
router.get("/:usertype", async (req, res) => {
  const page = req.query.page || 0;
  const productsPerPage = 10;

  const products = await Product.find()
    .populate("owner", "firstName lastName userType")
    .sort({ date: -1 })
    // .skip(page * productsPerPage)
    // .limit(productsPerPage)
    .select({
      name: 1,
      description: 1,
      tag: 1,
      price: 1,
      isAvailable: 1,
      size: 1,
      color: 1,
      owner: 1,
      productImg: 1,
    });

  const filtered = products.filter((product) => {
    if (product.owner.userType === req.params.usertype) {
      return true;
    }
    return false;
  });

  res.send(filtered);
});

//Get a product with a given id // this is helpful when a user wants to update a product so they look it up first
router.get("/id/:id", auth, async (req, res) => {
  const product = await Product.findById(req.params.id).select({
    name: 1,
    description: 1,
    tags: 1,
    price: 1,
    isAvailable: 1,
    isClothes: 1,
    size: 1,
    color: 1,
    productImg: 1,
  });

  if (!product)
    return res.status(404).send("The product with the given ID is not found.");
  res.send(product);
});

//get all products (pagination)
router.get("/", async (req, res) => {
  const page = req.query.page || 0;
  const productsPerPage = 10;

  const products = await Product.find({ isAvailable: true })
    .populate("owner", "firstName lastName") //query a refrenced document
    .sort({ date: -1 })
    // .skip(page * productsPerPage)
    // .limit(productsPerPage)
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
        productImg: 1,
      } /*return these properties to the user*/
    ); //pagination
  res.send(products);
  if (!products) return res.status(404);
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
    productImg: req.body.productImg,
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
    // $set: {
    name: req.body.name,
    description: req.body.description,
    tags: req.body.tags,
    price: req.body.price,
    isAvailable: req.body.isAvailable,
    isClothes: req.body.isClothes,
    color: req.body.color,
    size: req.body.size,
    // }, //the update object
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
