const BaseModel = require('./base.model')
const QueryBuilder = require('../utils/QueryBuilder')

const init = {
    table: 'loan',
    includes: [
        'id','userId','loanAmount',
        'interestRate', 'startDate', 'endDate',
        'status'
    ]
}

const queryBuilder = new QueryBuilder(init)
    
class LoanModel extends BaseModel {
    constructor(){
        super(queryBuilder)
    }
}

module.exports = LoanModel