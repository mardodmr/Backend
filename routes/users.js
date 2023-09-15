const express = require("express");
const mongoose = require("mongoose");
const { User, Credential } = require("../schemas/user");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const auth = require("../middleware/auth"); //autherization

//Users Backend

//View user's info
router.get("/me", auth, async (req, res) => {
  const user = await User.findeOne({ userCredentials: req.user._id }).select(
    "_id firstName lastName phone socials cashId address governorate"
  ); // <-- i may exclude other properties
  res.send(user);
});

//create user (register)
router.post("/credentials", async (req, res) => {
  let userCredentials = await Credential.findOne({ email: req.body.email });
  if (userCredentials) return res.status(400).send("User already registered.");

  userCredentials = new Credential({
    email: req.body.email,
    password: req.body.password,
  });

  const salt = await bcrypt.genSalt(10);
  userCredentials.password = await bcrypt.hash(userCredentials.password, salt);

  await userCredentials.save();

  const token = userCredentials.generateAuthToken();

  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(["id", "email"]));
  //store this token in front-end
});

//Add(create) user info after registration
router.post("/", auth, async (req, res) => {
  const userInfo = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    socials: req.body.socials,
    cashId: req.body.cashId,
    address: req.body.address,
    governorate: req.body.governorate,
    userCredentials: req.user._id,
  });
  const result = await userInfo.save();

  res.send(result);
});

//Update
router.put("/:id", auth, async (req, res) => {
  //Lookup the users
  const user = await User.findOneAndUpdate(
    { userCredentials: req.user._id },
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      socials: req.body.socials,
      cashId: req.body.cashId,
      address: req.body.address,
      governorate: req.body.governorate,
    }
  );
  if (!user)
    return res.status(404).send("The user with the given ID is not found");

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
