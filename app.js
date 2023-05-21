const express = require('express');
const auth = require('./auth.js');

const app = express();
app.use(express.static('pages'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

// Set view engine
app.set('view engine', 'ejs');

// Connect to database
const mysql = require('mysql');
const util = require('util');
// Create a connection to the MySQL databse
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3333,
  user: 'root',
  password: 'root',
  database: 'g00411261',
});

const query = util.promisify(connection.query).bind(connection);

auth.createUser('user', 'pass');

// Test connection with database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err);
  } else {
    console.log('Connected to the database');
  }
});

// Static files
app.use(express.static('home'));

app.get('/home', (req, res) => {
  connection.query(
    'SELECT * FROM proddata JOIN genres ON proddata.gid = genres.genreid',
    async (err, rows, fields) => {
      if (err) {
        console.error('Error retrieving product options');
        res.status(500).send('Error retrieving data');
      } else if (rows.length === 0) {
        console.error('No product options found');
        res.status(404).send('No product options found');
      } else {
        console.log('Product options retrieved from database');
        let movies = new Map();
        for (let i = 0; i < rows.length; i++) {
          movies.set(rows[i].prodid, {
            title: rows[i].title,
            image1: rows[i].image1,
          });
        }
        res.render('home', { movies });
      }
    }
  );
});

app.get('/shop', async (req, res) => {
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
      'SELECT username, stars, date, text FROM reviews WHERE prodid = ? ORDER BY date DESC',
      [ID]
    );
    const otherReviews = await query(
      'SELECT username, stars, date, text FROM reviews WHERE prodid != ? ORDER BY date DESC',
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
        title: product[0].title,
        image1: product[0].image1,
        image2: product[0].image2,
        image3: product[0].image3,
        genre: product[0].genre,
        gid: product[0].gid,
        director: product[0].director,
        sizes,
        reviews,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Error retrieving data');
  }
});

app.get('/genre', (req, res) => {
  const gid = req.query.gid;
  connection.query(
    'SELECT * FROM proddata JOIN genres ON proddata.gid = genres.genreid WHERE proddata.gid = ?',
    [gid],
    (err, rows, fields) => {
      if (err) {
        console.error('Error retrieving movies');
        res.status(500).send('Error retrieving data');
      } else if (rows.length === 0) {
        console.error('No movies with that genre ID found');
        res.status(404).send('No movies with that genre ID found');
      } else {
        console.log('Movies retrieved from database');
        let movies = new Map();
        for (let i = 0; i < rows.length; i++) {
          movies.set(i + 1, {
            title: rows[i].title,
            image1: rows[i].image1,
          });
        }
        console.log(movies);
        res.render('genre', { movies, genre: rows[0].genre });
      }
    }
  );
});

// Checkout Page
app.get('/checkout', (req, res) => {
  let sizes = [];
  connection.query('SELECT * FROM sizes', (err, rows, fields) => {
    if (err) {
      console.error('Error retrieving product options');
      res.status(500).send('Error retrieving data');
    } else if (rows.length === 0) {
      console.error('No product options found');
      res.status(404).send('No product options found');
    } else {
      console.log('Product options retrieved from database');
      for (let i = 0; i < rows.length; i++) {
        sizes.push({
          id: rows[i].sizeid,
          dimx: rows[i].dimx,
          dimy: rows[i].dimy,
          price: rows[i].price,
        });
      }
      res.render('checkout.ejs', { sizes: sizes });
    }
  });
});

// User login POST
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const authenticated = auth.authenticateUser(username, password);

  if (authenticated) {
    res.render('home');
  } else {
    res.render('failed');
  }
});

async function getQuery(query) {
  try {
    const rows = await query(query);
    return rows;
  } catch (err) {
    console.log(err);
  }
}
