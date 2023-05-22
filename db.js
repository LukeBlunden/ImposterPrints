const mysql = require('mysql');
const util = require('util');

// Create a connection to the MySQL databse
let connection = mysql.createConnection({
  host: 'localhost',
  port: 3333,
  user: 'root',
  password: 'root',
  database: 'g00411261',
});

// Test connection with database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err);
  } else {
    console.log('Connected to the database');
  }
});

// Binds connection context to connection.query method - allows us to await asynchronous queries
const query = util.promisify(connection.query).bind(connection);

module.exports = query;
