const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
require('dotenv').config();

/////////////// user schema ///////////////
const userSchema = new mongoose.Schema({
  firstName: {type: String, required: true, minlength: 3, maxlength: 50},
  lastName: {type: String, required: true, minlength: 3, maxlength: 50},
  phone: {type: String, required: true, minlength: 10, maxlength: 10},
  email: { type: String, unique: true, lowercase: true, required: true, },
  date: { type: Date, default: Date.now },
  socials: {
    type: Array,
    validate: {
      validator: function (v) {
        v.length > 0;
      },
      message: "You should provide at least one link.",
    }},
  cashId: {type: Number, required: true, unique: true, min:8 , max: 8},
  address: {type: String, required: true, minlength: 10, maxlength: 1024},
  userType: {type: String, enum: ['regular', 'a', 'b', 'f']},
  governorate: {type: String, required: true, enum: []},
  password: { type: String, required: true, minlength: 5, maxlength: 1024 },
  numberOfProducts: {type: Number, default: 0, min: 0}
});

userSchema.methods.generateAuthToken = function(){
  const token = jwt.sign({_id: this._id}, process.env.jwtPrivateKey);
  return token;
}

const User = mongoose.model("user", userSchema);

module.exports.User = User;
