const router = require('express').Router();
const auth = require('../auth.js');

router.get('/', (req, res) => {
  res.render('entry', {
    task: 'Login',
    route: 'login',
  });
});

router.post('/', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.render('entry', {
      task: 'Login',
      route: 'login',
      message: 'Please enter username and password',
    });
  } else {
    if (auth.authenticateUser(username, password)) {
      req.session.user = { username, password };
      res.redirect('/shop');
    } else {
      res.render('entry', {
        task: 'Login',
        route: 'login',
        message: 'Invalid credentials',
      });
    }
  }
});

module.exports = router;
