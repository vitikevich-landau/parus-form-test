const express = require('express');
const {verifyByPhone} = require("../controllers/employess");
const router = express.Router();

router.get('/verify-phone', verifyByPhone);

module.exports = router;
