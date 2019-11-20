const createError = require('http-errors');
const express = require('express');
const favicon = require('serve-favicon')
const path = require('path');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary')
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const branchesRouter = require('./routes/branches');
const flowersRouter = require('./routes/flowers');
const upload = require('express-fileupload');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const UserModel = require('./models/users');
require('dotenv').config();

const app = express();

//maybe i can delete this {useNewUrlParser: true}
mongoose.connect('mongodb://localhost/mongoose_try', {useNewUrlParser: true});
//maybe i can delete this line
mongoose.set('useFindAndModify', false);

  
  
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
})



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'images/favicon.gif')))
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
    cookie: {maxAge: parseInt(process.env.PASSPORT_MAX_AGE), httpOnly: false}, //half an hour
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
