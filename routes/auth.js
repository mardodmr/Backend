const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { Credential } = require("../schemas/user");
require("dotenv").config();

//this is to log in the user//
router.post("/", async (req, res) => {
  let user = await Credential.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  const token = user.generateAuthToken();

  res.send(token);
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

  console.log("i've hashed the password!");
  const token = userCredentials.generateAuthToken();
  try {
    if (token) await userCredentials.save();
  } catch (error) {
    console.log(error);
    return res.status(500).send("Somthing went wrong!");
  }
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(token);
  //store this token in front-end
});

module.exports = router;
