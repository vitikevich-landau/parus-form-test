const express = require(`express`);
const {verifyByPhone} = require(`../controllers/clients`);
const {create} = require(`../controllers/events`);
const router = express.Router();

router.get(`/verify-phone`, verifyByPhone);
router.post(`/send`, create);

module.exports = router;
