const {event} = require(`../models/Event`);
const {delay} = require("../lib/delay");

const create = async (req, res, next) => {

    console.log(req.body);

    res.send({});
};

module.exports = {
    create
}