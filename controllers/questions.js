const {validationResult} = require('express-validator');
const {formatPhoneNumber} = require("../lib/phones");
const {questions} = require(`../models/Questions`);
const {validate, sanitize} = require(`../validators/questionRequest`);

const register = async (req, res, next) => {
    await validate(req);
    await sanitize(req);

    /***
     *  Если есть ошибки дальше запрос не обрабатываем
     */
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(422).json({errors: errors.array()});
        // res.status(422).send({});

        return;
    }

    const {body} = req;
    const {phone, name, text, company} = body;
    const formattedPhone = formatPhoneNumber(phone);

    console.log(body);

    try {
        await questions.save(formattedPhone, name, text, company);

        res.send({});
    } catch (e) {
        res.status(404).send();
    }

}


module.exports = {
    register
};