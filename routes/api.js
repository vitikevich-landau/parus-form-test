const express = require('express');
const delay = require(`../lib/delay`);
const router = express.Router();

const {findByPhone} = require("../models/records");
const {getClientInfoByPhone} = require(`../models/db/queries`);
const {formatPhoneNumber} = require(`../lib/phones`);

router.get('/verify-phone', async function (req, res, next) {
    const {phone} = req.query;
    const formatted = formatPhoneNumber(phone);

    console.log(phone, formatted);
    const querySet = await getClientInfoByPhone(formatted);
    const {rows} = querySet;
    const answer = rows.map(r =>
        ({
            phone: r[1],
            phone2: r[2],
            fax: r[3],
            telex: r[4],
            name: r[5],
            title: r[7],
        })
    );

    console.log(rows);
    console.log(answer);

    /**
     *  Валидация длины телефонного номера
     *
     *  Не обрарабывать запросы если пришло что-то больше
     * */

    // const founded = findByPhone(phone);

    await delay();

    res.send(answer);
});

module.exports = router;
