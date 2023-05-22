const router = require('express').Router();

router.get('/', (req, res) => {
  try {
    req.session.destroy(() => {
      console.log('User logged out');
    });
    res.redirect('shop');
  } catch (err) {
    console.error(err);
    res.render('error', {
      status: 500,
      err,
    });
  }
});

module.exports = router;
