const express = require('express');
const router = express.Router();
const {getAllProducts, addProduct, getProductById, updateProduct, deleteProduct} = require('../Controllers/product.controller');

//all products 
router.get('/', getAllProducts);

//add products
router.post('/add', addProduct);

//getproductbyid
router.get('/:id', getProductById);

//update products
router.put('/:id', updateProduct);

//delete products
router.delete('/:id', deleteProduct);

module.exports = router;