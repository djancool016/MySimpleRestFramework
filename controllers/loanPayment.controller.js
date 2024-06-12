const baseController = require('./base.controller')
const LoanPaymentModel = require('../models/loanPayment.model')
const LoanModel = require('../models/loan.model')
const CustomError = require('../utils/CustomError')
const logging = require('../config').logging

const loanModel = new LoanModel()
const loanPaymentModel = new LoanPaymentModel()

async function createPayment(req, res, next){
    try {
        if(req.result?.status === false) return next()

        // get loan info
        const loan = await loanModel.findByPk(req.body.loanId)
        if(!loan.data) throw new CustomError('ER_NOT_FOUND', 'Loan data not found')
        
        // create new loan payment
        const payment = await loanPaymentModel.create(req.body)
        
        if(payment.status){
            req.result = payment.data
            return next()
        }
        throw new CustomError('ER_PAYMENT_FAILED', 'Failed to create new payment')
        
    } catch (error) {
        if(logging) console.error(error)
        const err = req.result = mysqlErrHandler(error)
        return next(err)
    }
}


const controller = (method) => (req, res, next) => baseController[method](req, res, next, model)

module.exports = {
    create: controller('create'),
    read: controller('read'),
    update: controller('update'),
    destroy: controller('destroy')
}