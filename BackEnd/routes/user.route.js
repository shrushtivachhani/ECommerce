const express = require('express');
const { signup, login } = require('../Controllers/user.controller');
const router = express.Router();


//signup route
router.post('/register', signup);

//login route
router.post('/login', login);

module.exports = router;