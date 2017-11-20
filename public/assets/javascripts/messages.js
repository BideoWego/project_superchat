

function roomsShow() {
  // ----------------------------------------
  // Templates
  // ----------------------------------------

  var templates = {};

  templates.message = function(message) {
    const $timestamp = $('<span>')
      .addClass('timestamp')
      .text(message.createdAt + ' - ');

    const $username = $('<span>')
      .addClass('username')
      .text(message.username + ' - ');

    const $body = $('<span>')
      .addClass('body')
      .text(message.body);

    return $('<p>')
      .addClass('message')
      .append(
        $timestamp,
        $username,
        $body
      );
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
    var roomId = $('#chat').attr('data-room-id');
    var socket = io.connect(baseUrl);


    $('#message-create').submit(function(e) {
      e.preventDefault();
      var body = $('#message').val();

      if (!body) {
        return;
      }

      var message = {
        body: body,
        roomId: roomId
      };

      socket.emit('messages.create.request', message);
      $('#message').val('');
    });


    socket.on('messages.create.response', function(response) {
      if (response.error) {
        console.error(response);
        return;
      }

      if (response.roomId != roomId) {
        return;
      }

      var $message = templates.message(response);
      $('#chat')
        .append($message);
      scrollToBottom();
    });
  });
}


if ($('#rooms-show').length) {
  roomsShow();
}
