const express = require('express');
const router = express.Router();
const { addToCart, deleteFromCart, updateCart } = require('../Controllers/cart.controller');

//add to cart
router.post('/addCart', addToCart);

//delete from cart
router.delete('/delete/:id', deleteFromCart);

//update cart
router.put('/update', updateCart);

module.exports = router;