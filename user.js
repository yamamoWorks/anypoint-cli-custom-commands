var _ = require('lodash')
var Table = require('../../table')
var moment = require('moment')
var cmn = require('./common')
var uris = require('./uris')

function userList (session) {
  return function () {
    var self = this
    return session.get(uris.users(session))
      .then(function (users) {
        var table = new Table({
          head: ['Username', 'Fullname', 'Email', 'Enabled'],
          colWidths: [30, 30, 40, 9]
        })
        _.each(users.data, function (user) {
          var data = [user.username, user.firstName + ' ' + user.lastName, user.email, user.enabled]
          table.push(data)
          })
        self._log(table)
      })
  }
}

function userCreate (session) {
  return function (args) {
    var self = this
    var req = {
      url: uris.users(session),
      body: {
        username: args.username,
        firstName: args.firstName,
        lastName: args.lastName,
        email: args.email,
        password: args.password,
        phoneNumber: args.options.phoneNumber
      }
    }
    return session.post(req)
      .then(function () {
        self.log('OK')
      })
  }
}

function changeUserStatus (session, args, enabled) {
  var self = this
  return cmn.getUserByName(session, args.username)
    .then(function (user) {
      var req = {
        url: uris.user(session, user.id),
        body: {
          enabled: enabled
        }
      }
      return session.put(req)
        .then(function () {
          self.log('OK')
        })
    })
}

function userDisable (session) {
  return function (args) {
    return changeUserStatus.call(this, session, args, false)
  }
}

function userEnable (session) {
  return function (args) {
    return changeUserStatus.call(this, session, args, true)
  }
}

function userDelete (session) {
  return function (args) {
    var self = this
    return cmn.getUserByName(session, args.username)
      .then(function (user) {
        var req = {
          url: uris.user(session, user.id),
        }
        return session.del(req)
          .then(function () {
            self.log('OK')
          })
      })
  }
}


module.exports = function (cli, session) {
  cli
    .command('account user list', 'Lists users')
    .action(userList(session))

  cli
  .command('account user create <username> <firstName> <lastName> <email> <password>', 'Create new user')
  .option('--phoneNumber [phoneNumber]', 'phoneNumber')
  .types({
    string: ['username', 'firstName', 'lastName', 'email', 'phoneNumber', 'password']
  })
  .action(userCreate(session))

  cli
  .command('account user disable <username>', 'Disable user')
  .types({
    string: ['username']
  })
  .action(userDisable(session))

  cli
  .command('account user enable <username>', 'Enable user')
  .types({
    string: ['username']
  })
  .action(userEnable(session))

  cli
  .command('account user delete <username>', 'Delete user')
  .types({
    string: ['username']
  })
  .action(userDelete(session))
}
