const router = require('express').Router();
const query = require('../db');
const getUsername = require('../getUsername.js');
const getGenres = require('../getGenres.js');
const getSizes = require('../getSizes.js');

// Checkout get
router.get('/', signedIn, async (req, res) => {
  try {
    // Gets product info from proddata
    const products = await query('SELECT prodid, title, image1 FROM proddata');
    // Renders checkout page with sizes, username, genres and product info
    res.render('checkout.ejs', {
      sizes: await getSizes(res),
      username: getUsername(req),
      genres: await getGenres(res),
      products,
    });
    // Alerts if there is an error and renders error page with message
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
  // Retrieves customer details from checkout form
  const { name, email, address, city, county, country, payment } = req.body;
  try {
    // Inserts customer details into database
    const result = await query(
      'INSERT INTO orders (name, email, address, city, county, country, payment) VALUES (?,?,?,?,?,?,?)',
      [name, email, address, city, county, country, payment]
    );
    if (result.affectedRows > 0) {
      console.log('Insert successful');
    }
    // Once successful redirects customer back to shop
    res.redirect('../shop');
    // Alerts if there is an error and renders error page with message
  } catch (err) {
    console.error('Error posting checkout information');
    res.render('error', {
      status: 500,
      err,
    });
  }
});

// Middleware checks that user is signed in
function signedIn(req, res, next) {
  // If user is signed in continues with request
  if (req.session.user) {
    next();
  } else {
    let err = new Error('Not logged in');
    next(err);
  }
}

// Middleware redirect to login if not signed in
router.use('/', (err, req, res, next) => {
  console.error(err);
  // Redirect to login contains query to flag redirect came from checkout
  res.redirect('login?checkout=true');
});

module.exports = router;
