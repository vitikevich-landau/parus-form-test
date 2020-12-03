const express = require(`express`);
const {verifyByPhone} = require(`../controllers/clients`);
const {register} = require(`../controllers/questions`);

const {check} = require('express-validator');

const router = express.Router();

router.get(
    `/verify-phone`,
    [check(`phone`).matches(/\+7 \(([0-9]{3})\) ([0-9]{3}) ([0-9]{4})/)],
    verifyByPhone
);

router.post(`/send`, register);

module.exports = router;
