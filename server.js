const express = require('express');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const _ = require('lodash');
const socketIO = require('socket.io');

require('./config/passport-local');
require('./config/passport-google');
const keys = require('./config/keys');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const homeRoutes = require('./routes/home');
const groupRoutes = require('./routes/groups');

let { Users } = require('./socket/onlineUsers');

//setting up mongodb connection
mongoose.connect(
  'mongodb://' +
    keys.mongodb.user +
    ':' +
    keys.mongodb.psd +
    '@ds131601.mlab.com:31601/chatoly'
);

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//setting up server side socket.io
require('./socket/groupChat')(io, Users);
require('./socket/friendRequest')(io);

//setting up the middlewares
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(validator());
app.use(
  session({
    secret: keys.sessionSecret,
    resave: true,
    saveUninitialized: true,
    store: new mongoStore({ mongooseConnection: mongoose.connection })
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//setting up the routes
app.use(userRoutes);
app.use(adminRoutes);
app.use(homeRoutes);
app.use('/group', groupRoutes);

//setting global variable
app.locals._ = _;

// starting the server
server.listen('3000', () => {
  console.log('listen at port 3000');
});
