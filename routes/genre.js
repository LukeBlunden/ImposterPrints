const router = require('express').Router();
const query = require('../db');
const getUsername = require('../getUsername.js');
const getGenres = require('../getGenres.js');

// Genre get
router.get('/', async (req, res) => {
  // Gets genre id from request
  const gid = req.query.gid;
  try {
    // Selects movies matching that genre from database
    const movies = await query(
      'SELECT prodid, title, image1, genre FROM proddata JOIN genres ON proddata.gid = genres.genreid WHERE proddata.gid = ?',
      [gid]
    );
    // If no movies are found - renders an error
    // This shouldn't happen through normal usage as genres are dynamically generated
    if (movies.length === 0) {
      console.error('No movies with that genre ID found');
      res.render('error', {
        status: 404,
        err: 'No movies with that genre ID found',
      });
    } else {
      console.log('Movies retrieved from database');
      // Renders genre page with movies, selected genre, username, and other genres
      res.render('genre', {
        movies,
        genre: movies[0].genre,
        username: getUsername(req),
        genres: await getGenres(res),
      });
    }
    // Alerts if there is an error and renders error page with message
  } catch (err) {
    console.error(err);
    console.log('Error retrieving movies');
    res.render('error', {
      status: 500,
      err,
    });
  }
});

module.exports = router;
