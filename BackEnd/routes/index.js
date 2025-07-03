const express = require('express');
const userRoutes = require('../routes/user.route');
const productRoutes =require('../routes/product.route');
const cartRoutes = require('../routes/cart.route');
const paymentRoute = require('../routes/payment.route');
const router = express.Router();

router.use('/user', userRoutes);

router.use('/product', productRoutes);

router.use('/cart', cartRoutes);

router.use('/payment', paymentRoute);

module.exports = router;
