const express = require('express');
const auth = require('./auth.js');
const session = require('express-session');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Sets session secret key
app.use(
  session({ secret: 'a_secret_key', resave: true, saveUninitialized: true })
);

// Sets view engine
app.set('view engine', 'ejs');
// Sets static files location to home
app.use(express.static('home'));

// Sets different routes
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

// Creates default user
auth.createUser('user', 'pass');

// Listen on port 3000
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
