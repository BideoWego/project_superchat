

var baseUrl = $('body').eq(0).attr('data-base-url');
var socket = io.connect(baseUrl);

socket.on('connected', function(message) {
  alert(message);
});





