const query = require('./db');

// Query to DB to get all data from sizes table
// Made sense to make separate module as item and checkout both needed this information
async function getSizes(res) {
  try {
    const sizes = await query('SELECT * FROM sizes');
    // Renders an error if there is no sizes in the table
    if (sizes.length === 0) {
      console.error('No poster sizes found in database');
      res.render('error', {
        status: 404,
        err: 'No poster sizes found in database',
      });
      // Returns the data if it's found
    } else {
      console.log('Sizes retrived from database');
      return sizes;
    }
    // Alerts if there is an error and renders error page with message
  } catch (err) {
    console.log(err);
    res.render('error', {
      status: 500,
      err,
    });
  }
}

module.exports = getSizes;
