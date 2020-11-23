const express = require('express');
const auth = require('./auth');
const product = require('../controller/product');
const verification = require('./verification');
const router = express.Router();

router.post('/v1/register', auth.register.auth);

router.post('/v1/login', auth.login);

//Url Need Authorization
router.get('/v1/secret',verification(2), auth.secret);

router.get('/v1/product',verification(2), product.getBarang);

module.exports = router;