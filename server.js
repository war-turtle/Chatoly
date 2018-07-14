const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const validator = require('express-validator');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const _ = require('lodash');

require('./config/passport-local');
require('./config/passport-google');
const keys = require('./config/keys');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const homeRoutes = require('./routes/home');

//setting up mongodb connection
mongoose.connect(
  'mongodb://' +
    keys.mongodb.user +
    ':' +
    keys.mongodb.psd +
    '@ds131601.mlab.com:31601/chatoly'
);

const app = express();

const server = http.createServer(app);

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

//setting global variable
app.locals._ = _;

server.listen('3000', () => {
  console.log('listen at port 3000');
});
