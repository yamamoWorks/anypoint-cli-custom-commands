var _ = require('lodash')
var Table = require('../../table')
var moment = require('moment')
var cmn = require('./common')
var uris = require('./uris')

function roleList(session) {
  return function (args) {
    var self = this
    return session.get(uris.roles(session))
      .then(function (roles) {
        if (args.options.byExternalName !== undefined) {
          var table = new Table({
            head: ['Name', 'Description', 'Editable', 'External Name'],
            colWidths: [30, 40, 10, 30]
          })
          _.each(roles.data, function (role) {
            _.each(role.external_names, function (external_name) {
              var data = [role.name, role.description, role.editable, external_name]
              table.push(data)
            })
          })
          self._log(table)
        } else {
          var table = new Table({
            head: ['Name', 'Description', 'Editable', 'External Names'],
            colWidths: [30, 40, 10, 30]
          })
          _.each(roles.data, function (role) {
            var data = [role.name, role.description, role.editable, role.external_names.join('\n')]
            table.push(data)
          })
          self._log(table)
        }
      })
  }
}


module.exports = function (cli, session) {
  cli
    .command('account role list', 'Lists roles')
    .option('--byExternalName', 'Line by external name')
    .action(roleList(session))
}
