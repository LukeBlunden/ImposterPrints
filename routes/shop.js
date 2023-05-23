const router = require('express').Router();
const query = require('../db');
const getUsername = require('../getUsername.js');
const getGenres = require('../getGenres.js');

// Shop get
router.get('/', async (req, res) => {
  try {
    // Gets product and genre info from proddata and genres for the 4 features products
    const featuredMovies = await query(
      'SELECT prodid, title, image1 FROM proddata JOIN genres ON proddata.gid = genres.genreid WHERE prodid < 5'
    );
    // Gets product and genre info from proddata and genres for the rest of the movies
    const movies = await query(
      'SELECT prodid, title, image1 FROM proddata JOIN genres ON proddata.gid = genres.genreid WHERE prodid > 4'
    );
    // If no movies are found logs and renders an error
    if (movies.length === 0) {
      console.error('No products found');
      res.render('error', {
        status: 404,
        err: 'No products found',
      });
    } else {
      console.log('Product options retrieved from database');
      // Render the shop with the movie data, username and genres
      res.render('shop', {
        featuredMovies,
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
