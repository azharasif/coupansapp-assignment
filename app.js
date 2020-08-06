var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const VerifyTokenMiddleware = require('./middleware/validJwt');

var userLogin = require('./routes/login');
var userSignup = require('./routes/signUp');
var createCoupan = require('./routes/createCoupan');
var getCoupan = require('./routes/getCoupan');
var getallCoupan = require('./routes/getallCoupan');
var delcoupan = require ('./routes/deleteCoupan')


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/userLogin', userLogin);
app.use('/userSignup', userSignup);
app.use('/createcoupan',  VerifyTokenMiddleware.validJwt , createCoupan);
app.use('/getcoupan', VerifyTokenMiddleware.validJwt , getCoupan);
app.use('/getallcoupan',  VerifyTokenMiddleware.validJwt,getallCoupan);
app.use('/delCoupan', VerifyTokenMiddleware.validJwt ,delcoupan);
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
