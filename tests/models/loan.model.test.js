const BaseTestModel = require('./tester.model')
const LoanModel = require('../../models/loan.model')
const {changeObjKey} = require('../../utils/TestUtils')

const loanObj = {
    userId: 1,
    loanAmount: 1000000,
    interestRate: 1.45,
    startDate: '2024-05-21',
    endDate: '2025-05-21'
}
const expectedFindResult = {
    userId: 1,
    loanAmount: 1000000,
    interestRate: "1.45"
}

const testObj = {
    create: [
        {
            input: loanObj,
            output: {status: true, data: {affectedRows: 1, insertId: 2}},
            description: 'Success should returning status true and insertId'
        },{
            input: changeObjKey('userId', 'userIdX', loanObj),
            output: {status: false, code: 'ER_BAD_FIELD_ERROR'},
            description: 'Invalid key should returning code ER_BAD_FIELD_ERROR'
        }
    ],
    findByPk: [
        {
            input: 1,
            output: {status: true, data: [expectedFindResult]},
            description: 'Success should returning data array'
        },
        {
            input: 9999,
            output: {status: false, code: 'ER_NOT_FOUND'},
            description: 'Not found should returning code ER_NOT_FOUND'
        },
        {
            input: undefined,
            output: {status: false, code: 'ER_BAD_FIELD_ERROR'},
            description: 'Invalid params should returning code ER_BAD_FIELD_ERROR'
        }
    ],
    findAll: [
        {
            input: {},
            output: {status: true, data: [expectedFindResult]},
            description: 'Success should returning data array'
        }
    ],
    findByKeys: [
        {
            input: {userId: 1},
            output: {status: true, data: [expectedFindResult]},
            description: 'Success should returning data array'
        },{
            input: {userIdX: 1},
            output: {status: false, code: 'ER_NOT_FOUND'},
            description: 'Invalid key should returning code ER_NOT_FOUND'
        },{
            input: {},
            output: {status: false, code: 'ER_NOT_FOUND'},
            description: 'empty body should returning code ER_NOT_FOUND'
        }
    ],
    update: [
        {
            input: {id: 2, interestRate: 1.50},
            output: {status: true, data: {affectedRows: 1}},
            description: 'Successfull update should return data'
        },{
            input: {id: 9999, interestRate: 1.50},
            output: {status: false, code: 'ER_NOT_FOUND'},
            description: 'Not found id should return code ER_NOT_FOUND'
        },{
            input: {idX: 2, interestRate: 1.50},
            output: {status: false, code: 'ER_BAD_FIELD_ERROR'},
            description: 'invalid key should return code ER_BAD_FIELD_ERROR'
        }
    ],
    delete: [
        {
            input: 2,
            output: {status: true, data: {affectedRows: 1}},
            description: 'Successfull delete should return data'
        },{
            input: undefined,
            output: {status: false, code: 'ER_BAD_FIELD_ERROR'},
            description: 'Invalid params should return code ER_BAD_FIELD_ERROR'
        },{
            input: 9999,
            output: {status: false, code: 'ER_NOT_FOUND'},
            description: 'Not found id should return code ER_NOT_FOUND'
        }
    ]
}
const model = new LoanModel()
const test = new BaseTestModel(testObj, model)

test.runTest()