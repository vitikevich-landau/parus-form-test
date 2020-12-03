const {clients} = require(`../models/Clients`);
const {formatPhoneNumber} = require(`../lib/phones`);
const {delay} = require(`../lib/delay`);

const {check, validationResult} = require('express-validator');

const verifyByPhone = async (req, res, next) => {
    /***
     *  Если есть ошибки дальше запрос не обрабатываем
     */
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // res..json({errors: errors.array()});
        res.status(422).send({});

        return;
    }

    const {phone} = req.query;
    const formatted = formatPhoneNumber(phone);

    console.log(req.query);
    const querySet = await clients.getByPhone(formatted);
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

    res.send(answer.length ? answer : {});
};

module.exports = {
    verifyByPhone
};