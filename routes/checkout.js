const router = require('express').Router();
const query = require('../db');
const getUsername = require('../getUsername.js');

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
  let sizes = [];
  try {
    const rows = await query('SELECT * FROM sizes');
    if (rows.length === 0) {
      console.error('No product options found');
      res.status(404).send('No product options found');
    } else {
      console.log('Product options retrieved from database');
      for (let i = 0; i < rows.length; i++) {
        sizes.push({
          id: rows[i].sizeid,
          dimx: rows[i].dimx,
          dimy: rows[i].dimy,
          price: rows[i].price,
        });
      }
      res.render('checkout.ejs', {
        sizes: sizes,
        username: getUsername(req),
      });
    }
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
  res.redirect('login');
});

module.exports = router;
