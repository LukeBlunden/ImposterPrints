const query = require('./db');

async function getGenres(res) {
  try {
    const genres = await query('SELECT * FROM genrses');
    if (genres.length === 0) {
      console.error('No genres found');
      res.render('error', {
        status: 404,
        err: 'No genres found',
      });
    } else {
      console.log('Genres retrieved from database');
      return genres;
    }
  } catch (err) {
    console.error(err);
    res.render('error', {
      status: 500,
      err,
    });
  }
}

module.exports = getGenres;
