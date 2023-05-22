const router = require('express').Router();
const query = require('../db');
const getUsername = require('../getUsername.js');
const getGenres = require('../getGenres.js');

// Item route
router.get('/', async (req, res) => {
  // Gets poster dimensions and prices
  let sizes = [];
  try {
    sizes = await query('SELECT * FROM sizes');
    console.log('Sizes retrived from database');
    if (sizes.length === 0) {
      console.error('No poster sizes found in database');
      res.status(404).send('No poster sizes found in database');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Error retrieving data');
  }

  const ID = req.query.rec;

  let reviews = [];
  try {
    const reviewRowsID = await query(
      'SELECT prodid, username, stars, date, text FROM reviews WHERE prodid = ? ORDER BY date DESC',
      [ID]
    );
    const otherReviews = await query(
      'SELECT prodid, username, stars, date, text FROM reviews WHERE prodid != ? ORDER BY date DESC',
      [ID]
    );
    reviews = reviewRowsID.concat(otherReviews).slice(0, 11);
    if (reviews.length === 0) {
      console.log('No reviews found in database');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Error retrieving data');
  }

  try {
    const product = await query(
      'SELECT * FROM proddata JOIN genres ON proddata.gid = genres.genreid WHERE proddata.prodid = ?',
      [ID]
    );
    if (product.length === 0) {
      console.error('No rows selected for ID $[ID]');
      res.status(404).send('No products found');
    } else {
      res.render('item.ejs', {
        prodid: product[0].prodid,
        title: product[0].title,
        image1: product[0].image1,
        image2: product[0].image2,
        image3: product[0].image3,
        genre: product[0].genre,
        gid: product[0].gid,
        director: product[0].director,
        sizes,
        reviews,
        username: getUsername(req),
        genres: JSON.stringify(await getGenres()),
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Error retrieving data');
  }
});

module.exports = router;
