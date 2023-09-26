const jwt = require("jsonwebtoken");
const { User, Credential } = require("../schemas/user");
require("dotenv").config();

async function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided");

  try {
    //loading user's credentials id
    const decoded = jwt.verify(token, process.env.jwtPrivateKey);
    req.credentials = decoded._id;

    //loading user's email
    const credentials = await Credential.findOne({
      _id: decoded._id,
    }).select("email");
    req.email = credentials.email;

    //loading user's id ///problem///
    const user = await User.findOne({ userCredentials: decoded._id }).select(
      "_id"
    ); // <-- i may exclude other properties
    if (user) req.user = user;

    next();
  } catch (ex) {
    res.status(401).send("Invalid token.");
  }
}

module.exports = auth;
