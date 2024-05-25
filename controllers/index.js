const { sendResponse } = require('./base.controller');

module.exports = {
    roles: require('./roles.controller'),
    users: require('./users.controller'),
    sendResponse
}