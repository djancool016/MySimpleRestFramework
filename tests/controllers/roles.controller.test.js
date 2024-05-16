const {create, read, update, destroy} = require('../../controllers/roles.controller') 
const {RolesModel} = require('../../models')
const {db, pool, truncateAll} = require('../../database').init()
const {seedTables} = require('../../seeders')

describe('Test Roles Controler', () => {

    let res
    let next
    let model

    beforeAll(async () => {
        await db.connect().then(async db => {
            await truncateAll(db)
            await seedTables(db)
        })
        res = {}
        next = () => {}
        model = new RolesModel()

    })
    describe('Test CREATE function', () => {
        test('using standard body should run model.create() then returning status 201', async () => {
            const req = { body: {
                name: 'Test Roles', 
                description: 'This is inserted from jest'
            }}
            const expectedResult = {status: true, code: 201, data: {affectedRows: 1}}
            await create(req, res, next, model)

            expect(req.result?.status).toBe(expectedResult.status)
            expect(req.result?.code).toBe(expectedResult.code)
            expect(req.result?.data).toEqual(expect.objectContaining(expectedResult.data))
        })
        test('using empty body should run model.create() then returning status 400', async () => {
            const req = { body: {}}
            const expectedResult = {status: false, code: 400}
            await create(req, res, next, model)

            expect(req.result?.status).toBe(expectedResult.status)
            expect(req.result?.code).toBe(expectedResult.code)
            expect(req.result?.data).toBeUndefined()
        })
    })

    describe('Test READ function', () => {
        test('using standard body should run model.findByKeys() then returning status 200 and contain data', async () => {
            const req = { body: {id: 1, name:'Admin'}}
            const expectedResult = {status: true, code: 200, data: [{id: 1, name:'Admin'}]}
            await read(req, res, next, model)

            expect(req.result?.status).toEqual(expectedResult.status)
            expect(req.result?.code).toEqual(expectedResult.code)
            expect(req.result?.data).toEqual(expect.arrayContaining(
                expectedResult?.data.map(out => expect.objectContaining(out))
            ))
        })
        test('using empty body should run model.findAll() then returning status 200 and contain data', async () => {
            const req = { body: {}}
            const expectedResult = {status: true, code: 200, data: [{id: 1, name:'Admin'}]}
            await read(req, res, next, model)

            expect(req.result?.status).toEqual(true)
            expect(req.result?.code).toEqual(200)
            expect(req.result?.data).toEqual(expect.arrayContaining(
                expectedResult?.data.map(out => expect.objectContaining(out))
            ))
        })
        test('using params.id should run model.findByPk() then returning status 200 and contain data', async () => {
            const req = {body: {}, params: {id: 1}}
            const expectedResult = {status: true, code: 200, data: [{id: 1, name:'Admin'}]}
            await read(req, res, next, model)

            expect(req.result?.status).toBe(true)
            expect(req.result?.code).toBe(200)
            expect(req.result?.data).toEqual(expect.arrayContaining(
                expectedResult?.data.map(out => expect.objectContaining(out))
            ))
        })
    })
    describe('Test UDPATE function', () => {
        test('using standard body should run model.update() then returning status 200', async () => {
            const req = {body: {id:1, name: 'Admin Updated'}}
            const expectedResult = {status: true, code: 200}
            await update(req, res, next, model)

            expect(req.result?.status).toBe(expectedResult.status)
            expect(req.result?.code).toBe(expectedResult.code)
        })
        test('using invalid body should run model.update() then returning status 400', async () => {
            const req = {body: {idX:1, nameX: 'Admin Updated'}}
            const expectedResult = {status: false, code: 400}
            await update(req, res, next, model)

            expect(req.result?.status).toBe(expectedResult.status)
            expect(req.result?.code).toBe(expectedResult.code)
        })
    })
    describe('Test DESTROY function', () => {
        test('using valid body should run model.update() then returning status 400', async () => {
            const req = {body: {id:2}}
            const expectedResult = {status: true, code: 200}
            await destroy(req, res, next, model)

            expect(req.result?.status).toBe(expectedResult.status)
            expect(req.result?.code).toBe(expectedResult.code)
        })
        test('deleting id used by foreign key should returning status 400', async () => {
            const req = {body: {id:1}}
            const expectedResult = {status: false, code: 400}
            await destroy(req, res, next, model)

            expect(req.result?.status).toBe(expectedResult.status)
            expect(req.result?.code).toBe(expectedResult.code)
        })
    })


    afterAll(async () => {
        await pool.end()
        await db.end()
    })
})