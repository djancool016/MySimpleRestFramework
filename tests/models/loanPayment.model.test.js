const BaseTestModel = require('./tester.model')
const LoanPaymentModel = require('../../models/loanPayment.model')
const {changeObjKey} = require('../../utils/TestUtils')

const inputData = {
    loanId: 1,
    paymentAmount: 150000,
    paymentDate: '2024-06-21',
}
const expectedResult = {
    id: 1,
    loanId: 1,
    paymentAmount: 100000
}

const testObj = {
    create: [
        {
            input: inputData,
            output: {status: true, data: {affectedRows: 1, insertId: 4}},
            description: 'Success should returning status true and insertId'
        },{
            input: changeObjKey('loanId', 'loanIdX', inputData),
            output: {status: false, code: 'ER_BAD_FIELD_ERROR'},
            description: 'Invalid key should returning code ER_BAD_FIELD_ERROR'
        }
    ],
    findByPk: [
        {
            input: 1,
            output: {status: true, data: [expectedResult]},
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
            output: {status: true, data: [expectedResult]},
            description: 'Success should returning data array'
        }
    ],
    findByKeys: [
        {
            input: {loanId: 1},
            output: {status: true, data: [expectedResult]},
            description: 'Success should returning data array'
        },{
            input: {loanIdX: 1},
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
            input: {id: 4, paymentAmount: 450000,},
            output: {status: true, data: {affectedRows: 1}},
            description: 'Successfull update should return data'
        },{
            input: {id: 9999, paymentAmount: 450000,},
            output: {status: false, code: 'ER_NOT_FOUND'},
            description: 'Not found id should return code ER_NOT_FOUND'
        },{
            input: {idX: 4, paymentAmount: 450000,},
            output: {status: false, code: 'ER_BAD_FIELD_ERROR'},
            description: 'invalid key should return code ER_BAD_FIELD_ERROR'
        }
    ],
    delete: [
        {
            input: 4,
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
const model = new LoanPaymentModel()
const test = new BaseTestModel(testObj, model)

test.runTest()