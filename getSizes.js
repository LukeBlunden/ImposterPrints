const query = require('./db');

async function getSizes() {
  try {
    const sizes = await query('SELECT * FROM sizes');
    if (sizes.length === 0) {
      console.error('No poster sizes found in database');
      res.status(404).send('No poster sizes found in database');
    } else {
      console.log('Sizes retrived from database');
      return sizes;
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Error retrieving data');
  }
}

module.exports = getSizes;
