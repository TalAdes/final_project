const createError = require('http-errors');
const express = require('express');
const favicon = require('serve-favicon')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const branchesRouter = require('./routes/branches');
const flowersRouter = require('./routes/flowers');
const upload = require('express-fileupload');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
// const cors = require('cors');
const session = require('express-session');
const UserModel = require('./models/users');
require('dotenv').config();

const app = express();

// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Credentials', true);
//   res.header('Access-Control-Allow-Origin', req.headers.origin);
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
//   if ('OPTIONS' == req.method) {
//     res.send(200);
//   } else {
//     next();
//   }
// });


//maybe i can delete this {useNewUrlParser: true}
mongoose.connect('mongodb://localhost/mongoose_try', {useNewUrlParser: true});
//maybe i can delete this line
mongoose.set('useFindAndModify', false);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'images/favicon.gif')))
// app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.json());
app.use(upload()); // configure middleware for uploading files
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser('secret'));
// Express session
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    // cookie: {maxAge: 1000*60, httpOnly: true} ,
    cookie: {maxAge: 99999999999*30*60*1000, httpOnly: false}, //half an hour
    rolling : true
    // cookie: {maxAge: 1000*60*15, httpOnly: true} 
    //milisoconds*seconds*minutes
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

passport.use(UserModel.createStrategy());

passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());


app.use('/flowers', flowersRouter);
app.use('/users', usersRouter);
app.use('/branches', branchesRouter);
app.use('/', indexRouter);

app.all('*', function (req, res) {
	res.redirect("/")
});

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
