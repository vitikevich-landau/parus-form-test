const consoleLog = (req, res, next) => {
    console.log(`${new Date()}, IP: ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}`);

    next();
}

module.exports = {
    consoleLog
};