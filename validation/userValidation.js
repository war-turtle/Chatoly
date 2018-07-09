module.exports = {
  SignUpValidation: (req, res, next) => {
    req
      .checkBody('username', 'Username must not be less than 5')
      .isLength({ min: 5 });
    req.checkBody('username', 'Username must not be empty').notEmpty();
    req.checkBody('email', 'Entered Email is Invalid').isEmail();
    req.checkBody('email', 'Email must not be Empty').notEmpty();
    req.checkBody('password', 'Password must not be Empty').notEmpty();
    req
      .checkBody('password', 'Password must be 5 words long')
      .isLength({ min: 5 });

    req
      .getValidationResult()
      .then(result => {
        let errors = result.array();
        let messages = [];

        errors.forEach(err => {
          messages.push(err.msg);
        });

        req.flash('error', messages);
        res.redirect('/signup');
      })
      .catch(err => {
        return next();
      });
  },
  LoginValidation: (req, res, next) => {
    req.checkBody('email', 'Email is Required').notEmpty();
    req.checkBody('email', 'Email is Invalid').isEmail();
    req.checkBody('password', 'Password is Required').notEmpty();
    req
      .checkBody('password', 'Password Must Not Be Less Than 5')
      .isLength({ min: 5 });

    req
      .getValidationResult()
      .then(result => {
        const errors = result.array();
        const messages = [];
        errors.forEach(error => {
          messages.push(error.msg);
        });

        req.flash('error', messages);
        res.redirect('/');
      })
      .catch(err => {
        return next();
      });
  }
};
