const express = require('express');
const userRoutes = require('../routes/user.route');
const productRoutes =require('../routes/product.route');
const cartRoutes = require('../routes/cart.route');
const router = express.Router();

router.use('/user', userRoutes);

router.use('/product', productRoutes);

router.use('/cart', cartRoutes);

module.exports = router;
