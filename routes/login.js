const router = require('express').Router();
const auth = require('../auth.js');
const getUsername = require('../getUsername.js');
const getGenres = require('../getGenres.js');
const getSizes = require('../getSizes.js');

router.get('/', (req, res) => {
  res.render('entry', {
    task: 'Login',
    route: 'login',
    checkoutFwd: req.query.checkout,
  });
});

router.post('/', async (req, res) => {
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

      if (req.query.checkout) {
        res.render('checkout.ejs', {
          sizes: await getSizes(),
          username: username,
          genres: await getGenres(),
        });
      } else {
        res.redirect('/shop');
      }
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
