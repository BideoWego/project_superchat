

module.exports = app => {

  // ----------------------------------------
  // Config
  // ----------------------------------------
  const server = require('http').createServer(app);
  const io = require('socket.io')(server);
  require('./client')(app);


  // ----------------------------------------
  // Sockets
  // ----------------------------------------
  const logger = require('./logger')(io);
  const messages = require('./messages');

  io.on('connection', socket => {
    logger(socket);
    messages(socket);
  });


  return server;
};
