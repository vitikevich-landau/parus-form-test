var express = require('express');
const delay = require(`../lib/delay`);

var router = express.Router();

const getData = async () => {
    let data;
    try {
        data = await delay();
    } catch (e) {
        console.error(e);
    }

    return data;
};

/* GET home page. */
router.get('/', async (req, res, next) => {
    res.render('index', {title: 'Регистрация событий'});
});


module.exports = router;
