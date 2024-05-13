const BaseModel = require('./base.model')
const QueryBuilder = require('../utils/QueryBuilder')

const init = {
    table: 'roles',
    includes: ['id','name', 'description']
}

const queryBuilder = new QueryBuilder(init)
    
class RolesModel extends BaseModel {
    constructor(){
        super(queryBuilder)
    }
}

module.exports = RolesModel