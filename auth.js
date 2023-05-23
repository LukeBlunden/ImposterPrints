// Store user credentials
const users = [];

// Creates a user and adds them to the store of users
function createUser(username, password) {
  users.push({ username, password });
}

// Checks the credentials supplied at login match with an existing user
function authenticateUser(username, password) {
  const user = users.find((user) => user.username === username);
  return !user || user.password !== password ? false : true;
}

// Checks if a username currently exists
function userExists(username) {
  return users.find((user) => user.username === username);
}

module.exports = { createUser, authenticateUser, userExists };
