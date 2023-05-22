const router = require('express').Router();
const query = require('../db');
const getUsername = require('../getUsername.js');
const getGenres = require('../getGenres.js');

// Shop route
router.get('/', async (req, res) => {
  try {
    const products = await query(
      'SELECT * FROM proddata JOIN genres ON proddata.gid = genres.genreid'
    );
    if (products.length === 0) {
      console.error('No products found');
      res.render('error', {
        status: 404,
        err: 'No products found',
      });
    } else {
      console.log('Product options retrieved from database');
      let movies = new Map();
      for (let i = 0; i < products.length; i++) {
        movies.set(products[i].prodid, {
          title: products[i].title,
          image1: products[i].image1,
        });
      }
      res.render('shop', {
        movies,
        username: getUsername(req),
        genres: await getGenres(res),
      });
    }
  } catch (err) {
    console.error('Error retrieving products');
    res.render('error', {
      status: 500,
      err,
    });
  }
});

module.exports = router;
