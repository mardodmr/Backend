const express = require("express");
const { User } = require("../schemas/user");
const router = express.Router();
require("dotenv").config();
const auth = require("../middleware/auth"); //autherization

//Users Backend

//User has product?
router.get("/hasproduct", auth, async (req, res) => {
  const has = await User.findOne({ _id: req.user }).select("numberOfProducts");
  res.send(has);
  //if (!has) return res.status(404).send("User doesn't have any products!");
});

//Get user's info
router.get("/me", auth, async (req, res) => {
  const user = await User.findOne({
    userCredentials: req.credentials,
  }).select({
    firstName: 1,
    lastName: 1,
    phone: 1,
    socials: 1,
    cashId: 1,
    address: 1,
    governorate: 1,
  });
  // console.log("test", req);
  res.status(200).send(user);
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
    userCredentials: req.credentials,
  });
  try {
    const result = await userInfo.save();

    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong when saving user info");
  }
});

//Update
router.put("/", auth, async (req, res) => {
  //Lookup the users
  const user = await User.findOneAndUpdate(
    { userCredentials: req.credentials },
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
