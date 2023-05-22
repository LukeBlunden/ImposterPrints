const router = require('express').Router();
const query = require('../db');
const getUsername = require('../getUsername.js');
const getGenres = require('../getGenres.js');

// Genre route
router.get('/', async (req, res) => {
  const gid = req.query.gid;
  try {
    const products = await query(
      'SELECT * FROM proddata JOIN genres ON proddata.gid = genres.genreid WHERE proddata.gid = ?',
      [gid]
    );
    if (products.length === 0) {
      console.error('No movies with that genre ID found');
      res.status(404).send('No movies with that genre ID found');
    } else {
      console.log('Movies retrieved from database');
      let movies = new Map();
      for (let i = 0; i < products.length; i++) {
        movies.set(i + 1, {
          title: products[i].title,
          image1: products[i].image1,
        });
      }
      console.log(movies);
      res.render('genre', {
        movies,
        genre: products[0].genre,
        username: getUsername(req),
        genres: await getGenres(),
      });
    }
  } catch {
    console.error('Error retrieving movies');
    res.status(500).send('Error retrieving data');
  }
});

module.exports = router;
