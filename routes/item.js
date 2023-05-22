const router = require('express').Router();
const query = require('../db');
const getUsername = require('../getUsername.js');
const getGenres = require('../getGenres.js');
const getSizes = require('../getSizes.js');

// Item route
router.get('/', async (req, res) => {
  const id = req.query.id;

  let reviews = [];
  try {
    const reviewRowsID = await query(
      'SELECT prodid, username, stars, date, text FROM reviews WHERE prodid = ? ORDER BY date DESC',
      [id]
    );
    const otherReviews = await query(
      'SELECT prodid, username, stars, date, text FROM reviews WHERE prodid != ? ORDER BY date DESC',
      [id]
    );
    reviews = reviewRowsID.concat(otherReviews).slice(0, 11);
    if (reviews.length === 0) {
      console.log('No reviews found in database');
    }
  } catch (err) {
    console.error(err);
    res.render('error', {
      status: 500,
      err,
    });
  }

  try {
    const product = await query(
      'SELECT * FROM proddata JOIN genres ON proddata.gid = genres.genreid WHERE proddata.prodid = ?',
      [id]
    );
    if (product.length === 0) {
      console.error('No rows selected for ID $[ID]');
      res.render('error', {
        status: 404,
        err: 'No products found for id',
      });
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
        sizes: await getSizes(res),
        reviews,
        username: getUsername(req),
        genres: await getGenres(res),
      });
    }
  } catch (err) {
    console.error(err);
    res.render('error', {
      status: 500,
      err,
    });
  }
});

router.post('/', async (req, res) => {
  const id = req.query.id;
  const { name, reviewRating, text } = req.body;
  console.log(id + ' ' + name + ' ' + reviewRating + ' ' + text);
  try {
    const result = await query(
      'INSERT INTO reviews (prodid, username, stars, date, text) VALUES (?,?,?,?,?)',
      [id, name, reviewRating, new Date(), text]
    );
    if (result.affectedRows > 0) {
      console.log('Insert successful');
    }
    res.redirect('/item?id=' + id);
  } catch (err) {
    console.error(err);
    res.render('error', {
      status: 500,
      err,
    });
  }
});

module.exports = router;
