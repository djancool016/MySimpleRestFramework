const baseController = require('./base.controller')
const LoanModel = require('../models/loan.model')
const model = new LoanModel

const controller = (method) => (req, res, next) => baseController[method](req, res, next, model)

module.exports = {
    create: controller('create'),
    read: controller('read'),
    update: controller('update'),
    destroy: controller('destroy')
}