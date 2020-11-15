const express = require('express');
const delay = require(`../lib/delay`);
const router = express.Router();

const {findByPhone} = require("../models/records");

router.get('/verify-phone', async function (req, res, next) {
    const {phone} = req.query;

    /**
     *  Валидация длины телефонного номера
     *
     *  Не обрарабывать запросы если пришло что-то больше
     * */

    /**
     *  Вызов методов модели
     *
     * */
    const founded = findByPhone(phone);

    await delay();

    res.send(founded);
});

module.exports = router;
