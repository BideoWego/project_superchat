const express = require('express');
const router = express.Router();


router.use((req, res, next) => {
  if (req.session.username) {
    req.user = { username: req.session.username };
    res.locals.currentUser = req.user;
  }

  const allowed = req.user ||
    req.path === '/login' ||
    req.path === '/logout' ||
    req.path === '/sessions';
  if (allowed) {
    next();
  } else {
    res.redirect('/login');
  }
});


router.get('/login', (req, res, next) => {
  try {
    res.render('sessions/new');
  } catch (e) {
    next(e);
  }
});


router.get('/logout', (req, res, next) => {
  try {
    delete req.session.username;
    res.redirect('/login');
  } catch (e) {
    next(e);
  }
});


router.post('/sessions', (req, res, next) => {
  try {
    if (req.body.username && req.body.username.trim() !== '') {
      req.session.username = req.body.username;
      res.redirect('/');
    } else {
      res.redirect('/login');
    }
  } catch (e) {
    next(e);
  }
});




module.exports = router;
