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
    const products = await query('SELECT prodid, title, image1 FROM proddata');
    res.render('checkout.ejs', {
      sizes: await getSizes(),
      username: getUsername(req),
      genres: await getGenres(),
      products,
    });
  } catch (err) {
    console.error('Error retrieving product options');
    res.render('error', {
      status: 500,
      err,
    });
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
    console.error('Error posting checkout information');
    res.render('error', {
      status: 500,
      err,
    });
  }
});

// Middleware redirect if user not logged in
router.use('/', (err, req, res, next) => {
  console.error(err);
  res.redirect('login?checkout=true');
});

module.exports = router;
