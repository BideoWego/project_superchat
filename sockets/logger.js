const ioWildcard = require('socketio-wildcard')();
const highlight = require('cli-highlight').highlight;


module.exports = io => {
  io.use(ioWildcard);

  return socket => {
    socket.on('*', packet => {
      const data = JSON.stringify(packet.data, null, 2);
      const lit = highlight(data, { language: 'json', ignoreIllegals: true });
      const str = `Socket data received: ${ lit }`;
      console.log(`***\n${ str }\n***\n\n`);
    });
  };
};
