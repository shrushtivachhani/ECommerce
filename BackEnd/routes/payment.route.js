const express = require('express');
const router = express.Router();
const {createPaymentSession } = require('../Controllers/payment.controller');

//payment session
router.post('/payment-session', createPaymentSession);

module.exports = router;