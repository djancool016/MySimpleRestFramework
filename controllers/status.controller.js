const baseController = require('./base.controller')
const StatusModel = require('../models/status.model')
const model = new StatusModel

const controller = (method) => (req, res, next) => baseController[method](req, res, next, model)

module.exports = {
    create: controller('create'),
    read: controller('read'),
    update: controller('update'),
    destroy: controller('destroy')
}