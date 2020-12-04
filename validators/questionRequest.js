const {check, body} = require('express-validator');
const {COMPANY_TITLE_SIZE, CLIENT_NAME_SIZE, MESSAGE_TEXT_SIZE} = require(`../db/config`);

const validate = async req => {
    await check(`phone`)
        .matches(/^\+7 \(([0-9]{3})\) ([0-9]{3}) ([0-9]{4})$/)
        .run(req);
    await check(`company`)
        .isLength({max: COMPANY_TITLE_SIZE})
        .run(req);
    await check(`name`)
        .isLength({min: 1, max: CLIENT_NAME_SIZE})
        .run(req);
    await check(`text`)
        .isLength({min: 1, max: MESSAGE_TEXT_SIZE})
        .run(req);

};

const sanitize = async req => {
    await body(`name`)
        .trim()
        .run(req);
    await body(`company`)
        .trim()
        .run(req);
    await body(`text`)
        .trim()
        .escape()
        .run(req);
};

module.exports = {
    validate,
    sanitize
};