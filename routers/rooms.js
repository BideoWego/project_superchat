const express = require('express');
const router = express.Router();
const {
  Message,
  Room
} = require('../models');


router.get(['/', '/rooms'], async (req, res, next) => {
  try {
    const rooms = await Room.all();
    res.render('rooms/index', { rooms });
  } catch (e) {
    next(e);
  }
});


router.get('/rooms/:id', async (req, res, next) => {
  try {
    const room = await Room.find(req.params.id);
    const messages = await Message.findByRoomId(room.id);
    res.render('rooms/show', { room, messages });
  } catch (e) {
    next(e);
  }
});


router.post('/rooms', async (req, res, next) => {
  try {
    if (!req.body.name) {
      res.redirect('/');
    } else {
      const room = await Room.create({
        name: req.body.name,
        username: req.session.username
      });
      res.redirect(`/rooms/${ room.id }`);
    }
  } catch (e) {
    next(e);
  }
});




module.exports = router;
