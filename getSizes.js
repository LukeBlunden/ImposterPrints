const query = require('./db');

async function getSizes(res) {
  try {
    const sizes = await query('SELECT * FROM sizes');
    if (sizes.length === 0) {
      console.error('No poster sizes found in database');
      res.render('error', {
        status: 404,
        err: 'No poster sizes found in database',
      });
    } else {
      console.log('Sizes retrived from database');
      return sizes;
    }
  } catch (err) {
    console.log(err);
    res.render('error', {
      status: 500,
      err,
    });
  }
}

module.exports = getSizes;
