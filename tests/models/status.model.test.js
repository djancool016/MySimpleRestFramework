const BaseTestModel = require('./base.test.model')
const StatusModel = require('../../models/status.model')
const testObj = {
    create: [
        {
            input: {name: 'Test new status'},
            output: {status: true, data: {affectedRows: 1, insertId: 10}},
            description: 'Success should returning status true and insertId'
        },{
            input: {nameX: 'Test new status'},
            output: {status: false, code: 'ER_BAD_FIELD_ERROR'},
            description: 'Invalid key should returning code ER_BAD_FIELD_ERROR'
        }
    ],
    findByPk: [
        {
            input: 1,
            output: {status: true, data: [{id: 1, name: 'Application Submitted'}]},
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
            output: {status: true, data: [{id: 1, name: 'Application Submitted'}]},
            description: 'Success should returning data array'
        }
    ],
    findByKeys: [
        {
            input: {name: 'App'},
            output: {status: true, data: [{id: 1, name: 'Application Submitted'}]},
            description: 'Success should returning data array'
        },{
            input: {nameX: 'App'},
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
            input: {id: 10, name: 'test jest'},
            output: {status: true, data: {affectedRows: 1}},
            description: 'Successfull update should return data'
        },{
            input: {id: 9999, name: 'test jest'},
            output: {status: false, code: 'ER_NOT_FOUND'},
            description: 'Not found id should return code ER_NOT_FOUND'
        },{
            input: {idX: 10, name: 'test jest'},
            output: {status: false, code: 'ER_BAD_FIELD_ERROR'},
            description: 'invalid key should return code ER_BAD_FIELD_ERROR'
        }
    ],
    delete: [
        {
            input: 10,
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
const model = new StatusModel()
const test = new BaseTestModel(testObj, model)

test.runTest()