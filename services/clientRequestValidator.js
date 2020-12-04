const {check} = require('express-validator');

const validate = async req => {
    await check(`phone`)
        .matches(/^\+7 \(([0-9]{3})\) ([0-9]{3}) ([0-9]{4})$/)
        .run(req);
};

module.exports = {
    validate,
};