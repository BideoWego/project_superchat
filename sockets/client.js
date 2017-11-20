const express = require('express');


module.exports = app => {
  app.use('/socket.io', express.static(
   `${ __dirname }/../node_modules/socket.io-client/dist/`
  ));
};
