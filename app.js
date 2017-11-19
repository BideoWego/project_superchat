const express = require('express');
const app = express();


// ----------------------------------------
// ENV
// ----------------------------------------
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}


// ----------------------------------------
// Models
// ----------------------------------------
const models = require('./models');
const {
  Message
} = models;


// ----------------------------------------
// Socket.io
// ----------------------------------------
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use('/socket.io', express.static(
 `${ __dirname }/node_modules/socket.io-client/dist/`
));


io.on('connection', socket => {
  socket.on('messages.create.request', async message => {
    let response;
    try {
      message = await Message.create(message);
      response = message;
    } catch (e) {
      response = { error: e, message: e.message, stack: e.stack };
    }
    socket.emit('messages.create.response', response);
  });
});


// ----------------------------------------
// Body Parser
// ----------------------------------------
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


// ----------------------------------------
// Sessions/Cookies
// ----------------------------------------
const cookieSession = require('cookie-session');

app.use(cookieSession({
  name: 'session',
  keys: [
    process.env.SESSION_SECRET || 'secret'
  ]
}));

app.use((req, res, next) => {
  app.locals.session = req.session;
  next();
});


// ----------------------------------------
// Flash Messages
// ----------------------------------------
const flash = require('express-flash-messages');
app.use(flash());


// ----------------------------------------
// Method Override
// ----------------------------------------
const methodOverride = require('method-override');
const getPostSupport = require('express-method-override-get-post-support');

app.use(methodOverride(
  getPostSupport.callback,
  getPostSupport.options // { methods: ['POST', 'GET'] }
));


// ----------------------------------------
// Referrer
// ----------------------------------------
app.use((req, res, next) => {
  req.session.backUrl = req.header('Referer') || '/';
  next();
});


// ----------------------------------------
// Public
// ----------------------------------------
app.use(express.static(`${__dirname}/public`));


// ----------------------------------------
// Logging
// ----------------------------------------
const morgan = require('morgan');
const morganToolkit = require('morgan-toolkit')(morgan);

app.use(morganToolkit());


// ----------------------------------------
// Routes
// ----------------------------------------
app.use((req, res, next) => {
  if (req.session.username) {
    req.user = { username: req.session.username };
    res.locals.currentUser = req.user;
  }

  const allowed = req.user ||
    req.path === '/login' ||
    req.path === '/logout' ||
    req.path === '/sessions';
  if (allowed) {
    next();
  } else {
    res.redirect('/login');
  }
});


app.get('/', async (req, res, next) => {
  try {
    const messages = await Message.all();
    res.render('rooms/show', { messages });
  } catch (e) {
    next(e);
  }
});


app.get('/login', (req, res, next) => {
  try {
    res.render('sessions/new');
  } catch (e) {
    next(e);
  }
});


app.get('/logout', (req, res, next) => {
  try {
    delete req.session.username;
    res.redirect('/login');
  } catch (e) {
    next(e);
  }
});


app.post('/sessions', (req, res, next) => {
  try {
    if (req.body.username && req.body.username.trim() !== '') {
      req.session.username = req.body.username;
      res.redirect('/');
    } else {
      res.redirect('/login');
    }
  } catch (e) {
    next(e);
  }
});


// ----------------------------------------
// Template Engine
// ----------------------------------------
const expressHandlebars = require('express-handlebars');
const helpers = require('./helpers');

const hbs = expressHandlebars.create({
  helpers: helpers,
  partialsDir: 'views/',
  defaultLayout: 'application'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


// ----------------------------------------
// Server
// ----------------------------------------
const port = process.env.PORT ||
  process.argv[2] ||
  3000;
const host = 'localhost';

let args;
process.env.NODE_ENV === 'production' ?
  args = [port] :
  args = [port, host];

args.push(() => {
  console.log(`Listening: http://${ host }:${ port }\n`);
});

if (require.main === module) {
  app.locals.baseUrl = `http://${ host }:${ port }`;
  server.listen.apply(server, args);
}


// ----------------------------------------
// Error Handling
// ----------------------------------------
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.stack) {
    err = err.stack;
  }
  res.status(500).render('errors/500', { error: err });
});


module.exports = app;
