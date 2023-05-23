const query = require('./db');

// Creates a user and adds them to the user table in DB
async function createUser(username, password) {
  const result = await query(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, password]
  );
  // Log if insert is successful
  if (result.affectedRows > 0) {
    console.log('Insert successful');
  }
}

// Checks the credentials supplied at login match with an existing user in database
async function authenticateUser(username, password) {
  const users = await query('SELECT username, password FROM users');
  const user = users.find((user) => user.username === username);
  return !user || user.password !== password ? false : true;
}

// Checks if a username currently exists in database
async function userExists(username) {
  const users = await query('SELECT username, password FROM users');
  return users.find((user) => user.username === username);
}

module.exports = { createUser, authenticateUser, userExists };
