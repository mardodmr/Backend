const express = require("express");
const mongoose = require("mongoose");
const { User } = require("../schemas/product");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const auth = require("../middleware/auth"); //autherization

//Users Backend

//View user's info
router.get("/me", auth, async (req, res) => {
  const user = await User.findeById(req.user._id).select("-password"); // <-- i may exclude other properties
  res.send(user);
});

//create user register
router.post("/", async (req, res) => {
  let user = await User.findOne({ email: req.params.email });
  if (!user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.params, ["email", "password"]));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(["id", "email"]));
  //store this token in front-end
});

//Update
router.put("/:id", auth, async (req, res) => {
  //Lookup the users
  //If not existing, return 404 (recourse not found)

  //Update the user
  //Return the updated user
  res.send();
});

//I'm not sure whether to implement this method
router.delete("/:id", (req, res) => {
  //Lookup the course
  //If not existing, return 404

  //Delete

  //Return the same product

  res.send();
});

module.exports = router;
