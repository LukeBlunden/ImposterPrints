const query = require('./db');

// Query to DB to get all data from genres table
// Useful as all pages with navbar need this data for the navbar genre dropdown
async function getGenres(res) {
  try {
    const genres = await query('SELECT * FROM genres');
    // Renders an error if there is no genres in the table
    if (genres.length === 0) {
      console.error('No genres found');
      res.render('error', {
        status: 404,
        err: 'No genres found',
      });
      // Returns the data if it's found
    } else {
      console.log('Genres retrieved from database');
      return genres;
    }
    // Alerts if there is an error and renders error page with message
  } catch (err) {
    console.error(err);
    res.render('error', {
      status: 500,
      err,
    });
  }
}

module.exports = getGenres;
