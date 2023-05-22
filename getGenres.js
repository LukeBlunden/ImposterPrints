const query = require('./db');

async function getGenres() {
  try {
    const genres = await query('SELECT * FROM genres');
    if (genres.length === 0) {
      console.error('No genres found');
      res.status(404).send('No genres found');
    } else {
      console.log('Genres retrieved from database');
      return genres;
    }
  } catch {
    console.error('Error retrieving product options');
    res.status(500).send('Error retrieving data');
  }
}

module.exports = getGenres;
