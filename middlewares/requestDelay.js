const {delay} = require("../lib/delay");

const forceDelay = async (req, res, next) => {
    await delay(550, 2250);

    next();
}

module.exports = {
    forceDelay
};