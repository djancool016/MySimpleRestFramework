const {statusLogger, dataLogger} = require('../utils/HttpLogger')
const mysqlErrCode = require('../utils/MysqlErrorCode')
const {create, read, update, destroy, sendResponse} = require('./base.controller')


module.exports = {
    create, read, update, destroy, sendResponse
}