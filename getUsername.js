function getUsername(req) {
  return req.session.user === undefined ? 'Guest' : req.session.user.username;
}

module.exports = getUsername;
