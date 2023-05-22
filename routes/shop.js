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
      console.error('No product options found');
      res.status(404).send('No product options found');
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
        genres: JSON.stringify(await getGenres()),
      });
    }
  } catch {
    console.error('Error retrieving product options');
    res.status(500).send('Error retrieving data');
  }
});

module.exports = router;
