const express = require("express");
const mongoose = require("mongoose");
const { User } = require("../schemas/product");
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/', async (req, res) =>{
    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Invalid email or password.')

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) return res.status(400).send('Invalid email or password')

    const token = user.generateAuthToken();

    res.send(token);
});

module.exports = router;