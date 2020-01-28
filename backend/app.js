const createError = require('http-errors');
const express = require('express');
const favicon = require('serve-favicon')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const branchesRouter = require('./routes/branches');
const chatRouter = require('./routes/chat');
const flowersRouter = require('./routes/flowers');
const cartRouter = require('./routes/cart');
const upload = require('express-fileupload');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const UserModel = require('./models/users');
const socketio = require('socket.io');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./chat/users');
require('dotenv').config();
const ChatModel = require('./models/chats');

var debug = require('debug')('lab5:server');
var http = require('http');

const app = express();
var port = '8080';
app.set('port', port);

// var server = require('./bin/www');
var server = http.createServer(app);
const io = socketio(server
  // ,{pingTimeout: 5000000000}
  );
server.listen(port);
server.on('listening', onListening);

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('Listening on ' + bind);
  console.log();
  debug('Listening on ' + bind);
}





//maybe i can delete this {useNewUrlParser: true}

mongoose.connect('mongodb+srv://tadestades:tadestades@cluster0-hekkm.mongodb.net/mern_proj', {useNewUrlParser: true});
// mongoose.connect('mongodb://localhost/mongoose_try', {useNewUrlParser: true});
//maybe i can delete this line
mongoose.set('useFindAndModify', false);



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
    // cookie: {maxAge: parseInt(process.env.PASSPORT_MAX_AGE), httpOnly: false}, //half an hour
    rolling : true,
    cookie: {maxAge: 1000*60*15, httpOnly: true} //quarter an hour
    //milisoconds*seconds*minutes
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

passport.use(UserModel.createStrategy());

passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

io.on('connect', (socket) => {
  socket.on('join', async ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if(error) return callback(error);

    socket.join(user.room);
    
    //sent that only the socket owner see
    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
    console.log('server - sending `welcome to room` message event');
    await sleep(200)
    //retrieve messages
    // setTimeout(async function(){ 
    //   var chat = await ChatModel.findOne({id:user.room});
    //   socket.emit('message',{messages : chat.history} ); 
    // }, 500);

    //broadcast to everyone in the room
    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    console.log('server - sending `roomData` message event');


    var chat = await ChatModel.findOne({id:user.room});
    let index = chat.history.length - 20
    if (index < 0) {
      index = 0
    }
    for ( ; index < chat.history.length; index++) {
      var message = chat.history[index];
      console.log(`the message is ${message.text}`);
      socket.emit('message',message );
      await sleep(200)
    }
    
    // chat.history.forEach(message => {
    //   sleep(10000).then(() => {
    //     console.log(`the message is ${message.text}`);
    //     socket.emit('message',message )
    //   }
    //   )
    // });


    //sent that only the socket owner don't see
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
    console.log('server - sending `has joined!` message event');
    
    
    callback();
  });

  socket.on('sendMessage', async (message, callback) => {
    const user = getUser(socket.id);
    console.log('server - got send message event');

    //broadcast to everyone in the room
    //i need to check if this is really what happen:
    //when i send the message it is not appear on the chat till i get event from server
    console.log('server - sending message event');
    io.to(user.room).emit('message', { user: user.name, text: message });
    var chat = await ChatModel.findOne({id:user.room})
    var newHistory = [...chat.history,{text:message,user:user.name}]
    await ChatModel.findOneAndUpdate({id:user.room},{history : newHistory})
    callback();
  });

  socket.on('disconnect', (reason) => {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>disconected because of '+reason);
    const user = removeUser(socket.id);

    if(user) {
      console.log('i am emiting because some one disconnected');
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  })

  socket.on('i want more', async (counter,callback) => {
    socket.emit('reset');
    const user = getUser(socket.id);
    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
    await sleep(200)
    var chat = await ChatModel.findOne({id:user.room});
    let index = chat.history.length - 20*counter.counter
    if (index < 0) {
      index = 0
    }
    for ( ; index < chat.history.length; index++) {
      var message = chat.history[index];
      console.log(`the message is ${message.text}`);
      socket.emit('message',message );
      await sleep(200)
    }
    callback();
  })

});




app.use('/chat_back', chatRouter);
app.use('/cart', cartRouter);
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
