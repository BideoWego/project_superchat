const { Message } = require('../models');


module.exports = socket => {
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
};
