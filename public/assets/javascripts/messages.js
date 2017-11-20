

function roomsShow() {
  // ----------------------------------------
  // Templates
  // ----------------------------------------

  var templates = {};

  templates.message = function(message) {
    const $timestamp = $('<span>')
      .addClass('message timestamp')
      .text(message.createdAt + ' - ');

    const $username = $('<span>')
      .addClass('message username')
      .text(message.username + ' - ');

    const $body = $('<span>')
      .addClass('message body')
      .text(message.body);

    return $('<p>').append(
      $timestamp,
      $username,
      $body
    )
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
}


if ($('#rooms-show').length) {
  roomsShow();
}
