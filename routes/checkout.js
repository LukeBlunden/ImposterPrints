const router = require('express').Router();
const query = require('../db');
const getUsername = require('../getUsername.js');
const getGenres = require('../getGenres.js');
const getSizes = require('../getSizes.js');

// Middleware checks for user sign in
function signedIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    let err = new Error('Not logged in');
    next(err);
  }
}

// Checkout get
router.get('/', signedIn, async (req, res) => {
  try {
    res.render('checkout.ejs', {
      sizes: await getSizes(),
      username: getUsername(req),
      genres: await getGenres(),
    });
  } catch {
    console.error('Error retrieving product options');
    res.status(500).send('Error retrieving data');
  }
});

// Checkout post
router.post('/', async (req, res) => {
  const { name, email, address, city, county, country, payment } = req.body;
  try {
    const result = await query(
      'INSERT INTO orders (name, email, address, city, county, country, payment) VALUES (?,?,?,?,?,?,?)',
      [name, email, address, city, county, country, payment]
    );
    if (result.affectedRows > 0) {
      console.log('Insert successful');
    }
    res.redirect('../shop');
  } catch (err) {
    console.log(err);
    res.status(500).send('Error retrieving data');
  }
});

// Middleware redirect if user not logged in
router.use('/', (err, req, res, next) => {
  console.log(err);
  res.redirect('login?checkout=true');
});

module.exports = router;
