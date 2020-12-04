const rateLimit = require("express-rate-limit");

const setLimit = rateLimit({
    windowsMs: 60 * 1000,
    max: 25,
    message: `Слишком частое обращение к серверу, ожидайте в течении минуты`
    // headers: true
});

module.exports = {
    setLimit
};