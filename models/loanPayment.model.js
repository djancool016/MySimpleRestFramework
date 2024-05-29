const BaseModel = require('./base.model')
const QueryBuilder = require('../utils/QueryBuilder')

const init = {
    table: 'loanPayment',
    includes: [
        'id', 'loanId', 'paymentAmount', 'paymentDate'
    ],
    association: [
        {
            table: 'loan',
            references: 'loan.id',
            foreignKey: 'loanPayment.loanId',
            includes: ['userId']
        }
    ]
}

const queryBuilder = new QueryBuilder(init)
    
class LoanPaymentModel extends BaseModel {
    constructor(){
        super(queryBuilder)
    }
}

module.exports = LoanPaymentModel