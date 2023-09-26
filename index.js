const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");
const app = express();
const products = require("./routes/products");
const home = require("./routes/home");
const orders = require("./routes/orders");
const users = require("./routes/users");
const auth = require("./routes/auth");
require("dotenv").config();

if (!process.env.jwtPrivateKey) {
  console.error("FATAL ERROR: JWT Private Key is not defined.");
  process.exit(1);
}

mongoose
  .connect("mongodb://127.0.0.1/my-store")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

app.use(cors());
app.use(express.json()); //middleware pipline
app.use("/api/products", products);
app.use("/api/orders", orders);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/", home);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
