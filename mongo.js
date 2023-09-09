const mongoose = require("mongoose");
const {Product} = require('./schemas/product');



//Done
async function createProduct() {
  const product = new Product({
    //this is a Product object
    name: "First Product",
    description: "this is for testing",
    tags: "trial",
    price: 50,
    isAvailable: true,
    isClothes: false,
  });
  const result = await product.save();
  console.log(result);
}

//Done
async function getAllProducts() {
  const result = await Product.find();
  // .sort( { sort based on a property } )
  // .select( return the properties to the user )
  console.log(result);
}

//Done
async function updateProduct(id) {
  const product = await Product.findByIdAndUpdate(id, {
    /* $set: {

        }the update object */
  });
  console.log(product);
}

//Done
async function removeProduct(id) {
  const product = await Product.deleteOne({ _id: id });
  console.log(product);
}

getAllProducts();