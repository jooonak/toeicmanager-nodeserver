var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

var index = require('./routes/index');
var users = require('./routes/users');
var dic = require('./routes/dic');
var ocr = require('./routes/ocr');
var result = require('./routes/result');
var fcm = require('./routes/fcm');
// var autofcm = require('./routes/fcmschedule');
var crawling = require('./routes/crawling');
var chatbot = require('./routes/chatbot');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /publicrameter settimeout
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));
app.use(cors());
app.options('*', cors());

app.use('/', index);
app.use('/users', users);
app.use('/dic', dic);
app.use('/ocr', ocr);
app.use('/result', result);
app.use('/fcm', fcm);
app.use('/crawling', crawling);
app.use('/chatbot', chatbot);
// app.use(autofcm);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
