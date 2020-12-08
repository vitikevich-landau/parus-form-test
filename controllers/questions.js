const { validationResult } = require('express-validator');
const axios = require('axios');
const { formatPhoneNumber } = require("../lib/phones");
const { questions } = require(`../models/Questions`);
const { validate, sanitize } = require(`../validators/questionRequest`);

const register = async (req, res, next) => {
    await validate(req);
    await sanitize(req);

    /***
     *  Если есть ошибки дальше запрос не обрабатываем
     */
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        // res.status(422).send({});

        return;
    }

    const { body } = req;
    const { phone, name, text, company, token } = body;
    const formattedPhone = formatPhoneNumber(phone);

    console.log(body);


    if (token) {
        /***
         *  Пришло с внешнего хоста
         */
        const secret = `6Lc4dfwZAAAAAFGtBaWFxVfjZ1sz7K8HxvSGVAaj`;
        const google = await axios.get(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`);
        const { success, score } = google.data;

        if (success && score > 0.5) {
            /***
             *  DB methods
             */

            try {
                await questions.save(formattedPhone, name, text, company);

                res.send({});
            } catch (e) {
                res.status(404).send();
            }
        } else {
            /***
             *  Is bot
             */
            res.status(404).send();
        }

        console.log(google.data);
    } else {
        /***
         *  Если пришло с локалки
         */

        try {
            await questions.save(formattedPhone, name, text, company);

            res.send({});
        } catch (e) {
            res.status(404).send();
        }
    }
}


module.exports = {
    register
};