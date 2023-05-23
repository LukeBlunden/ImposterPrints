const router = require('express').Router();
const auth = require('../auth.js');

// Signup get
router.get('/', (req, res) => {
  try {
    // Renders entry page with signup routing
    res.render('entry', {
      task: 'Sign up',
      route: 'signup',
    });
    // Alerts if there is an error and renders error page with message
  } catch (err) {
    res.render('error', {
      status: 500,
      err,
    });
  }
});

// Signup post
router.post('/', (req, res) => {
  try {
    // Gets the username and password submitted by signup form
    const { username, password } = req.body;
    // Checks if username or password are missing
    if (!username || !password) {
      // If they are it re-renders the signup page with a warning message
      res.render('entry', {
        task: 'Sign up',
        route: 'signup',
        message: 'Please enter username and password',
      });
    } else {
      // Checks if the users credentials match an existing user
      if (auth.userExists(username)) {
        // If so it rerenders the signup page with a warning that user already exists
        res.render('entry', {
          task: 'Sign up',
          route: 'signup',
          message: 'User already exists, login or use a different username',
        });
        // If credentials are ok it creates a new user and adds them to session and redirects to shop
      } else {
        auth.createUser(username, password);
        req.session.user = { username, password };
        res.redirect(303, '/shop');
      }
    }
    // Alerts if there is an error and renders error page with message
  } catch (err) {
    res.render('error', {
      status: 500,
      err,
    });
  }
});

module.exports = router;
