const express = require("express");
const mongoose = require("mongoose");
const { User, Credential } = require("../schemas/product");
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


//this is to log in the user//
router.post('/', async (req, res) =>{
    let user = await Credential.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Invalid email or password.')

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) return res.status(400).send('Invalid email or password')

    const token = Credential.generateAuthToken();

    res.send(token);
});

module.exports = router;