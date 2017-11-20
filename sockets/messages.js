const { Message } = require('../models');
const helpers = require('../helpers');


module.exports = (io, socket) => {
  socket.on('messages.create.request', async message => {
    let response;
    try {
      message = await Message.create({
        body: message.body,
        username: socket.request.session.username,
        roomId: message.roomId
      });
      message.createdAt = helpers.datetime(message.createdAt);
      response = message;
    } catch (e) {
      response = { error: e, message: e.message, stack: e.stack };
    }
    io.sockets.emit('messages.create.response', response);
  });
};
