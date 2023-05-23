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
    // If customer info insert was succesful add order information
    if (result.affectedRows > 0) {
      // Get the order ID from the customer info insert
      orderId = result.insertId;
      // Get todays date
      const date = new Date();
      // Parses the order info from local storage sent by a hidden checkout input
      const orderInput = JSON.parse(req.body.orderInput);
      // Gets the keys of the order - the product ID's
      const keys = Object.keys(orderInput);
      // Loops through each product
      keys.forEach((key, index) => {
        // parse the product ID to an int
        let productId = parseInt(key);
        // Create map of size and quantity data for each product
        let map = new Map(JSON.parse(orderInput[key]));
        // For each size of a product ordered
        map.forEach(async (v, k) => {
          // Insert the item into the orderitems table of the database along with foreigh keys
          const insert = await query(
            'INSERT INTO orderitems (orderid, productid, sizeid, quantity, date) VALUES (?,?,?,?,?)',
            [orderId, productId, k, v, date]
          );
          if (insert.affectedRows > 0) {
            console.log('Item successfully insert');
          }
        });
      });
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
