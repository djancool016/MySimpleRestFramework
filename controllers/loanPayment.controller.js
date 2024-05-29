const baseController = require('./base.controller')
const loanPaymentModel = require('../models/loanPayment.model')
const model = new loanPaymentModel
const CustomError = require('../utils/CustomError')

async function getLoanDetail(req, res, next){
    try {
        if(req.result?.status === false) return next()
        if(!req.params.id) return new CustomError('ER_NOT_FOUND')
        
    } catch (error) {
        
    }
}


const controller = (method) => (req, res, next) => baseController[method](req, res, next, model)

module.exports = {
    create: controller('create'),
    read: controller('read'),
    update: controller('update'),
    destroy: controller('destroy')
}