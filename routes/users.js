const router = require('express').Router();
const passport = require('passport');
const {
  SignUpValidation,
  LoginValidation
} = require('../validation/userValidation');

router.get('/', (req, res) => {
  const errors = req.flash('error');
  res.render('index', {
    messages: errors,
    hasError: errors.length > 0,
    title: 'Chatoly | login'
  });
});

router.get('/signup', (req, res) => {
  const errors = req.flash('error');
  res.render('signup', {
    messages: errors,
    hasError: errors.length > 0,
    title: 'Chatoly | SignUp'
  });
});

router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/home',
    failureRedirect: '/',
    failureFlash: true
  })
);

router.post(
  '/',
  LoginValidation,
  passport.authenticate('local.login', {
    successRedirect: '/home',
    failureRedirect: '/',
    failureFlash: true
  })
);

router.post(
  '/signup',
  SignUpValidation,
  passport.authenticate('local.signup', {
    successRedirect: '/home',
    failureRedirect: '/signup',
    failureFlash: true
  })
);

module.exports = router;
