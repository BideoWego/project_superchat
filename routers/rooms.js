const express = require('express');
const router = express.Router();
const { Message } = require('../models');


router.get('/', async (req, res, next) => {
  try {
    const messages = await Message.all();
    res.render('rooms/show', { messages });
  } catch (e) {
    next(e);
  }
});




module.exports = router;
