const express = require(`express`);

const router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
    const {host} = req.headers;

    if (host.includes(`176.50.223.119`)) {
        res.render('index-recaptcha', {title: 'Задать вопрос'});
    } else {
        res.render('index', {title: 'Задать вопрос'});
    }

});


module.exports = router;
