const router = require('express').Router();
const query = require('../db');
const getUsername = require('../getUsername.js');
const getGenres = require('../getGenres.js');
const getSizes = require('../getSizes.js');

// Item get
router.get('/', async (req, res) => {
  // Gets movie ID from request
  const id = req.query.id;

  let reviews = [];
  try {
    // Selects reviews of the selected movie from DB
    const reviewRowsID = await query(
      'SELECT prodid, username, stars, date, text FROM reviews WHERE prodid = ? ORDER BY date DESC',
      [id]
    );
    // Selects 10 recent reviews of the other movies from DB
    const otherReviews = await query(
      'SELECT prodid, username, stars, date, text FROM reviews WHERE prodid != ? ORDER BY date DESC LIMIT 10',
      [id]
    );
    // concatenates these results together and keeps the first 10
    reviews = reviewRowsID.concat(otherReviews).slice(0, 11);
    if (reviews.length === 0) {
      // Output log if there are no reviews
      console.log('No reviews found in database');
    }
    // Alerts if there is an error and renders error page with message
  } catch (err) {
    console.error(err);
    res.render('error', {
      status: 500,
      err,
    });
  }

  try {
    // Selects product and genre data for the selected movie
    const product = await query(
      'SELECT * FROM proddata JOIN genres ON proddata.gid = genres.genreid WHERE proddata.prodid = ?',
      [id]
    );
    // Alerts if there is no data selected and render error page
    // This shouldn't happen through normal usage as products are dynamically generated
    if (product.length === 0) {
      console.error('No rows selected for ID $[ID]');
      res.render('error', {
        status: 404,
        err: 'No products found for id',
      });
      // Renders item page with data
    } else {
      res.render('item.ejs', {
        prodid: product[0].prodid,
        title: product[0].title,
        image1: product[0].image1,
        image2: product[0].image2,
        image3: product[0].image3,
        genre: product[0].genre,
        gid: product[0].gid,
        director: product[0].director,
        sizes: await getSizes(res),
        reviews,
        username: getUsername(req),
        genres: await getGenres(res),
      });
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

// Item post for reviews
router.post('/review', async (req, res) => {
  // Gets product id from request
  const id = req.query.id;
  // Gets review data from form inputs
  const { name, reviewRating, text } = req.body;
  try {
    // Insert review into review table of database
    const result = await query(
      'INSERT INTO reviews (prodid, username, stars, date, text) VALUES (?,?,?,?,?)',
      [id, name, reviewRating, new Date(), text]
    );
    // Logs if insert is successful
    if (result.affectedRows > 0) {
      console.log('Insert successful');
    }
    // If successful redirects back to the item page
    res.redirect('/item?id=' + id);
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
