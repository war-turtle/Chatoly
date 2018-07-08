const router = require('express').Router();
const passport = require('passport');

router.get('/', (req, res) => {
  res.send('how are you buddy');
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.get('/home', (req, res) => {
  res.render('home');
});

router.post(
  '/signup',
  passport.authenticate('local.signup', {
    successRedirect: '/home',
    failureRedirect: '/signup',
    failureFlash: true
  })
);

module.exports = router;
