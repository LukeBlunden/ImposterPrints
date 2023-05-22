const router = require('express').Router();
const auth = require('../auth.js');

router.get('/', (req, res) => {
  res.render('signup');
});

router.post('/', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.render('signup', { message: 'Please enter username and password' });
  } else {
    if (auth.userExists(username)) {
      res.render('signup', {
        message: 'User already exists, login or use a different username',
      });
    }
    auth.createUser(username, password);
    req.session.user = { username, password };
    res.redirect(303, 'shop');
  }
});

module.exports = router;
