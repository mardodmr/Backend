const jwt = require("jsonwebtoken");
const { User } = require("../schemas/user");
require("dotenv").config();

async function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided");

  try {
    const decoded = jwt.verify(token, process.env.jwtPrivateKey);
    req.credentials = decoded;

    const user = await User.findOne({ userCredentials: decoded }).select(
      "_id firstName lastName phone socials cashId address governorate"
    ); // <-- i may exclude other properties

    req.user = user;
    next();
  } catch (ex) {
    res.status(401).send("Invalid token.");
  }
}

module.exports = auth;
