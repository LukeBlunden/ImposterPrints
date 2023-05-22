const router = require('express').Router();

router.get('/', (req, res) => {
  req.session.destroy(() => {
    console.log('User logged out');
  });
  res.redirect('shop');
});

module.exports = router;
