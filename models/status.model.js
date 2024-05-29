const BaseModel = require('./base.model')
const QueryBuilder = require('../utils/QueryBuilder')

const init = {
    table: 'status',
    includes: ['id','name']
}

const queryBuilder = new QueryBuilder(init)
    
class StatusModel extends BaseModel {
    constructor(){
        super(queryBuilder)
    }
}

module.exports = StatusModel