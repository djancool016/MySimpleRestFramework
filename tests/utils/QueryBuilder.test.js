const QueryBuilder = require('../../utils/QueryBuilder')

describe('Test Build MYSQL2 Query using class QueryBuilder', () => {

    let model
    let queryParams
    let requestBody

    beforeAll(() => {
        model = {
            table: 'users',
            includes: [
                'id','roleId','username', 'email', 
                'name', 'phone', 'address','nik', 'status'
            ],
            alias: {nik: 'socialNumber'},
            association: [
                {
                    table: 'roles',
                    references: 'roles.id',
                    foreignKey: 'users.roleId',
                    includes: ['name', 'description'],
                    alias: {
                        name: 'role',
                        description: 'roleDescription'
                    }
                },
                {
                    table: 'orders',
                    references: 'orders.id',
                    foreignKey: 'users.orderId',
                    includes: ['code', 'total'],
                    joinType: 'OUTER JOIN'
                }
            ]
        }
        requestBody = {id: 1, username: 'JohnDoe', total: [1,2,3]}
        queryParams = new QueryBuilder(model, requestBody)
    })

    test('Test "create" method should return correct query and param', () => {
        const result = queryParams.create

        console.log(result)
        expect(result.query).toBeDefined()
        expect(result.param.length).toBe(3)
    })
    test('Test "readByPk" method should return correct query and param', () => {
        const result = queryParams.readByPk

        console.log(result)
        expect(result.query).toBeDefined()
        expect(result.param.length).toBe(1)
    })
    test('Test "readAll" method should return correct query and param', () => {
        const result = queryParams.readAll

        console.log(result)
        expect(result.query).toBeDefined()
        expect(result.param.length).toBe(0)
    })
    test('Test "readByKeys" method should return correct query and param', () => {
        const result = queryParams.readByKeys

        console.log(result)
        expect(result.query).toBeDefined()
        expect(result.param.length).toBe(5)
    })
    test('Test "update" method should return correct query and param', () => {
        const result = queryParams.update

        console.log(result)
        expect(result.query).toBeDefined()
        expect(result.param.length).toBe(3)
    })
    test('Test "delete" method should return correct query and param', () => {
        const result = queryParams.delete

        console.log(result)
        expect(result.query).toBeDefined()
        expect(result.param.length).toBe(1)
    })
})