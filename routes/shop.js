const router = require('express').Router();
const query = require('../db');
const getUsername = require('../getUsername.js');
const getGenres = require('../getGenres.js');

// Shop get
router.get('/', async (req, res) => {
  try {
    // Gets product and genre info from proddata and genres
    const products = await query(
      'SELECT * FROM proddata JOIN genres ON proddata.gid = genres.genreid'
    );
    // If no data is found logs and renders an error
    if (products.length === 0) {
      console.error('No products found');
      res.render('error', {
        status: 404,
        err: 'No products found',
      });
    } else {
      console.log('Product options retrieved from database');
      // If data is found, map the title and image1 to the id
      let movies = new Map();
      for (let i = 0; i < products.length; i++) {
        movies.set(products[i].prodid, {
          title: products[i].title,
          image1: products[i].image1,
        });
      }
      // Render the shop with the movie data, username and genres
      res.render('shop', {
        movies,
        username: getUsername(req),
        genres: await getGenres(res),
      });
    }
    // Alerts if there is an error and renders error page with message
  } catch (err) {
    console.error('Error retrieving products');
    res.render('error', {
      status: 500,
      err,
    });
  }
});

module.exports = router;
