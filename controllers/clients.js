const {validationResult} = require('express-validator');
const {clients} = require(`../models/Clients`);
const {formatPhoneNumber} = require(`../lib/phones`);
const {validate} = require(`../validators/clientRequest`);

const verifyByPhone = async (req, res, next) => {
    await validate(req);

    /***
     *  Если есть ошибки дальше запрос не обрабатываем
     */
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(422).json({errors: errors.array()});
        // res.status(422).send({});

        return;
    }

    const {phone} = req.query;
    const formatted = formatPhoneNumber(phone);

    console.log(req.query);
    let querySet;

    try {
        querySet = await clients.getByPhone(formatted)
    } catch (e) {
        res.status(404).send();

        return ;
    }

    const {rows} = querySet;
    const answer = rows.map(r =>
        ({
            phone: r[0],
            name: r[1],
            title: r[2],
        })
    );

    res.send(answer.length ? answer : {});
};

module.exports = {
    verifyByPhone
};