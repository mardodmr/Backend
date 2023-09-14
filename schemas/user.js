const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/////////////// user schema ///////////////
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: function () {
      return this.email;
    },
    minlength: 3,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: function () {
      return this.email;
    },
    minlength: 3,
    maxlength: 50,
  },
  phone: {
    type: String,
    required: function () {
      return this.email;
    },
    minlength: 10,
    maxlength: 10,
  },

  date: { type: Date, default: Date.now },
  socials: {
    type: Array,
    required: function () {
      return this.email;
    },
  },
  cashId: {
    type: Number,
    required: function () {
      return this.email;
    },
    unique: true,
  },
  address: {
    type: String,
    required: function () {
      return this.email;
    },
    minlength: 10,
    maxlength: 1024,
  },
  userType: { type: String, enum: ["regular", "a", "b", "f"], default: "regular" },
  governorate: { type: String, required: false, enum: [] },
  numberOfProducts: { type: Number, default: 0, min: 0 },
  userCredentials: { type: mongoose.Schema.Types.ObjectId, ref: "credential" },
});

//////////////////////////////////////////

const credentailSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true, required: true },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
});

credentailSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.jwtPrivateKey);
  return token;
};

const User = mongoose.model("user", userSchema);
const Credential = mongoose.model("credential", credentailSchema);

module.exports.User = User;
module.exports.Credential = Credential;
