// Store user credentials
const users = [];

function createUser(username, password) {
  users.push({ username, password });
  console.log(users);
}

function authenticateUser(username, password) {
  const user = users.find((user) => user.username === username);
  return !user || user.password !== password ? false : true;
}

function userExists(username) {
  users.filter((user) => {
    if (user.username === username) {
      return true;
    }
  });
}

module.exports = { createUser, authenticateUser, userExists };
