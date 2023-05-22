const router = require('express').Router();
const query = require('../db');
const auth = require('../auth.js');
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
  try {
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
          const products = await query(
            'SELECT prodid, title, image1 FROM proddata'
          );
          res.render('checkout.ejs', {
            sizes: await getSizes(res),
            username: username,
            genres: await getGenres(res),
            products,
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
  } catch (err) {
    console.error(err);
    res.render('error', {
      status: 500,
      err,
    });
  }
});

module.exports = router;
