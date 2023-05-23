// Returns the username stored in session if it exists, otherwise returns 'Guest'
function getUsername(req) {
  return req.session.user === undefined ? 'Guest' : req.session.user.username;
}

module.exports = getUsername;
