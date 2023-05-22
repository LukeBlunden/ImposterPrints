const express = require('express');
const auth = require('./auth.js');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.static('pages'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({ secret: 'a_secret_key', resave: true, saveUninitialized: true })
);

// Set view engine
app.set('view engine', 'ejs');
// Static files
app.use(express.static('home'));

const checkout = require('./routes/checkout.js');
app.use('/checkout', checkout);
const signup = require('./routes/signup.js');
app.use('/signup', signup);
const login = require('./routes/login.js');
app.use('/login', login);
const item = require('./routes/item.js');
app.use('/item', item);
const genre = require('./routes/genre.js');
app.use('/genre', genre);
const shop = require('./routes/shop.js');
app.use('/shop', shop);
const logout = require('./routes/logout.js');
app.use('/logout', logout);

// Default user
auth.createUser('user', 'pass');

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
