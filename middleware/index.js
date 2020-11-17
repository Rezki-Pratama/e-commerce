const express = require('express');
const auth = require('./auth');
const verification = require('./verification');
const router = express.Router();

router.post('/v1/register', auth.register.auth);

router.post('/v1/login', auth.login);

//Url Need Authorization
router.get('/v1/secret',verification(), auth.secret);

module.exports = router;