const router = require('express').Router();
const auth = require('../auth.js');

router.get('/', (req, res) => {
  res.render('entry', {
    task: 'Sign up',
    route: 'signup',
  });
});

router.post('/', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.render('entry', {
      task: 'Sign up',
      route: 'signup',
      message: 'Please enter username and password',
    });
  } else {
    if (auth.userExists(username)) {
      res.render('entry', {
        task: 'Sign up',
        route: 'signup',
        message: 'User already exists, login or use a different username',
      });
    } else {
      auth.createUser(username, password);
      req.session.user = { username, password };
      res.redirect(303, 'shop');
    }
  }
});

module.exports = router;
