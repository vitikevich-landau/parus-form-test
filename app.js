var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const rateLimit = require("express-rate-limit");

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
const {delay} = require("./lib/delay");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/***
 *  Request limiter
 *
 */
app.use(rateLimit({
    windowsMs: 60 * 1000,
    max: 25,
    message: `Слишком частое обращение к серверу, ожидайте в течении минуты`
    // headers: true
}));

/**
 *  console log all request
 *  time and IP
 */
app.use(
    (req, res, next) => {
      console.log(`${new Date()}, IP: ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}`);

      next();
    }
);

app.use('/', indexRouter);

/***
 *  Принудительный delay на rout'ы api
 */
app.use('/api', async (req, res, next) => {
   await delay(550, 2250);

    next();
});
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
