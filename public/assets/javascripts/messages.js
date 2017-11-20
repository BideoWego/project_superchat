// On message create
//  Send message to backend
//  Message comes back
//  Append to messages
//
//  Sort messages by timestamp?
//  Refresh all messages?
//  Limit displayed messages to number?
//  Scrolling?


// ----------------------------------------
// Templates
// ----------------------------------------

var templates = {};

templates.message = function(message) {
  return $('<p>')
    .text(message.createdAt + ' - ' + message.body);
};


// ----------------------------------------
// Scrolling
// ----------------------------------------
function scrollToBottom() {
  var scrollHeight = $('#chat').get(0).scrollHeight;
  $('#chat').scrollTop(scrollHeight);
}


$(document).ready(function() {
  scrollToBottom();

  // ----------------------------------------
  // Sockets
  // ----------------------------------------
  var baseUrl = $('body').eq(0).attr('data-base-url');
  var socket = io.connect(baseUrl);

  $('#message-create').submit(function(e) {
    e.preventDefault();
    var message = $('#message').val();
    socket.emit('messages.create.request', message);
    $('#message').val('');
  });

  socket.on('messages.create.response', function(response) {
    var $message = templates.message(response);
    $('#chat')
      .append($message);
    scrollToBottom();
  });
});
