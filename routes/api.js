const express = require(`express`);
const {verifyByPhone} = require(`../controllers/clients`);
const router = express.Router();

router.get(`/verify-phone`, verifyByPhone);

module.exports = router;
