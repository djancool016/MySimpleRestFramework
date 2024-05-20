const baseController = require('./base.controller')
const RolesModel = require('../models/roles.model')
const model = new RolesModel

const controller = (method) => (req, res, next) => baseController[method](req, res, next, model)

module.exports = {
    create: controller('create'),
    read: controller('read'),
    update: controller('update'),
    destroy: controller('destroy'),
    sendResponse: baseController.sendResponse
}