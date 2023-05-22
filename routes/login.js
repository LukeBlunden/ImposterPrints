const router = require('express').Router();
const auth = require('../auth.js');

router.get('/', (req, res) => {
  res.render('login');
});

router.post('/', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.render('login', { message: 'Please enter username and password' });
  } else {
    if (auth.authenticateUser(username, password)) {
      req.session.user = { username, password };
      res.redirect('/shop');
    } else {
      res.render('login', { message: 'Invalid credentials' });
    }
  }
});

module.exports = router;
