const BaseModel = require('./base.model')
const QueryBuilder = require('../utils/QueryBuilder')

const init = {
    table: 'users',
    includes: [
        'id','roleId','username', 'email', 
        'name', 'phone', 'address','nik', 'status'
    ],
    association: [
        {
            table: 'roles',
            references: 'roles.id',
            foreignKey: 'users.roleId',
            includes: ['name'],
            alias: {
                name: 'role'
            }
        }
    ]
}

const queryBuilder = new QueryBuilder(init)
    
class UsersModel extends BaseModel {
    constructor(){
        super(queryBuilder)
    }
}

module.exports = UsersModel