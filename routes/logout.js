const router = require('express').Router();

// Logout get
router.get('/', (req, res) => {
  try {
    // Destroys the user session
    req.session.destroy(() => {
      console.log('User logged out');
    });
    // Then redirects back to shop
    res.redirect('shop');
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
