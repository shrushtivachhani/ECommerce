const express = require('express');
const router = express.Router();
const { addToCart } = require('../Controllers/cart.controller');

//add to cart
router.post('/:id', addToCart);

module.exports = router;