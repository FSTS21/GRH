var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const adminRouter = require("./routes/admin")

var app = express();

app.use(require('express-formidable')());

require("dotenv").config({
  path: true
});
require('custom-env').env(true)

// var favicon = require('serve-favicon')

const i18n = require("i18n");
i18n.configure({
  locales: ['fr', 'ar'],
  // defaultLocale: 'fr',
  queryParameter: 'switch_lang',
  cookie: process.env.prefix + 'i18n_lang',
  updateFiles: true, // default true :: if I use some word don't exist on my files local, it will create automatically
  syncFiles: true, // default false
  autoReload: true, // defeaul false
  directory: __dirname + '/locales',
  objectNotation: true,
  // setting of log level DEBUG - default to require('debug')('i18n:debug')
  /* logDebugFn: function (msg) {
    console.log('debug', msg);
  }, */

  // setting of log level WARN - default to require('debug')('i18n:warn')
  logWarnFn: function (msg) {
    console.log('warn', msg);
  },

  // setting of log level ERROR - default to require('debug')('i18n:error')
  logErrorFn: function (msg) {
    console.log('error', msg);
  },
  api: {
    '__': 't', //now req.__ becomes req.t
    '__n': 'tn' //and req.__n can be called as req.tn
  },

});
i18n.setLocale("fr")
app.use(i18n.init);

/* ************************** create connection */
const mongoose = require("mongoose")
const mongoDB = process.env.mongoDB
// mongoose.Promise = global.Promise;
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
  useCreateIndex: true,
  useFindAndModify: false
});
// mongoose.set('debug', true);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connexion MongoDB:'));


// view engine setup
const registerHelper = require("./config/registerHelper")
const exphbs = require('express-handlebars');
const {
  allowInsecurePrototypeAccess
} = require('@handlebars/allow-prototype-access')
const Handlebars = require('handlebars')
app.set('view engine', 'hbs');
app.engine('hbs', exphbs({
  extname: "hbs",
  defaultLayout: "",
  partialsDir: [path.join(__dirname, 'views')],
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: {
    // Function to do basic mathematical operation in handlebar
    // t: registerHelper.t, 
    ...registerHelper
  }
}))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use("/admin/", adminRouter)
app.use("/fillingDB/", require("./routes/fillingDB"))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;