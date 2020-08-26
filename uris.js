var fmt = require('util').format
var utils = require('../../utils')

module.exports = {
  users: function (session) {
    return fmt(
      '/accounts/api/organizations/%s/users',
      session.selectedOrganization.id)
  },
  user: function (session, userId) {
    return fmt(
      '/accounts/api/organizations/%s/users/%s',
      session.selectedOrganization.id, userId)
  },
  roles: function (session) {
    return fmt(
      '/accounts/api/organizations/%s/rolegroups',
      session.selectedOrganization.id)
  },
}
