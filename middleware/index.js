const express = require('express');
const auth = require('./auth');
const router = express.Router();

router.post('/v1/register', auth.register.auth);

module.exports = router;