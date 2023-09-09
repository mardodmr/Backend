const {Product} = require('../schemas/product');
const express = require('express');
const router = express.Router();

//home route is not clear of its functionality
router.get('/', (req, res)=>{
    res.send();
});

router.get('/:category', (req, res)=>{
    res.send();
});

module.exports = router;