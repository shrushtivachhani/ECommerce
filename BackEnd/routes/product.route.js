const express = require('express');
const router = express.Router();
const {product, addProduct, getProductById} = require('../Controllers/product.controller');

//all products 
router.get('/', product);

//add product 
router.post('/add', addProduct);

//getproductbyid
router.get('/:id', getProductById);

module.exports = router;