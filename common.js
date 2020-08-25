var Promise = require('bluebird')
var fmt = require('util').format
var _ = require('lodash')
var uris = require('./uris')

function getUserByName (session, username) {
  return session.get(uris.users(session))
    .then(function (users) {
      var user = _.find(users.data, {username: username})
      if (!user) {
        return Promise.reject(
          fmt('User with username "%s" was not found', username))
      }
      return user
    })
}

module.exports = {
  getUserByName: getUserByName
}
