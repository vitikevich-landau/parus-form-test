const express = require(`express`);
const {verifyByPhone} = require(`../controllers/clients`);
const {register} = require(`../controllers/questions`);

const router = express.Router();

router.get(`/verify-phone`, verifyByPhone);
router.post(`/send`, register);

module.exports = router;
