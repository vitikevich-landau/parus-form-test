const {delay} = require("../lib/delay");
const {formatPhoneNumber} = require("../lib/phones");
const {questions} = require(`../models/Questions`);

const register = async (req, res, next) => {
    /***
     *  Validation, formatting, clearing
     *
     *  htmlspecial chars
     */

    const {body} = req;
    const {phone, name, text, company} = body;
    const formattedPhone = formatPhoneNumber(phone);

    console.log(body);

    // await questions.save(formattedPhone, name, text, company);

    res.send({});
}


module.exports = {
    register
};