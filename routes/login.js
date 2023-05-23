const router = require('express').Router();
const auth = require('../auth.js');

// Login get
router.get('/', (req, res) => {
  try {
    // Renders entry page with login routing and a checkout reidrect flag
    res.render('entry', {
      task: 'Login',
      route: 'login',
      checkoutFwd: req.query.checkout,
    });
    // Alerts if there is an error and renders error page with message
  } catch (err) {
    console.error('Error rendering login page');
    res.render('error', {
      status: 500,
      err,
    });
  }
});

// Login post
router.post('/', async (req, res) => {
  try {
    // Gets the username and password submitted by login form
    const { username, password } = req.body;
    // Checks if username or password are missing
    if (!username || !password) {
      // If they are it re-renders the login page with a warning message
      res.render('entry', {
        task: 'Login',
        route: 'login',
        message: 'Please enter username and password',
      });
    } else {
      // Checks that the users credentials match an existing user
      if (await auth.authenticateUser(username, password)) {
        // Creates a new session user (makes a cookie)
        req.session.user = { username, password };
        // If there was a checkout flag, redirects to checkout
        if (req.query.checkout) {
          res.redirect('/checkout');
          // Otherwise it redirects to the shop
        } else {
          res.redirect('/shop');
        }
        // If credentials don't match, rerenders login page with warning message
      } else {
        res.render('entry', {
          task: 'Login',
          route: 'login',
          message: 'Invalid credentials',
        });
      }
    }
    // Alerts if there is an error and renders error page with message
  } catch (err) {
    console.error(err);
    res.render('error', {
      status: 500,
      err,
    });
  }
});

module.exports = router;
