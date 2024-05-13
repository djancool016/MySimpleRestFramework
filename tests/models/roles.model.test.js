const {RolesModel} = require('../../models')
const {db, pool, truncateAll} = require('../../database').init()
const {seedTables} = require('../../seeders')
 
describe('Test Implementing all BaseModel method using RolesModel class', () => {

    let model

    beforeAll(async () => {
        await db.connect().then(async db => {
            await truncateAll(db)
            await seedTables(db)
        })
        model = new RolesModel()
    })

    describe('Test "create" method', () => {
        test('Success should returning status true and insertId', async() => {
            const requestBody = {
                name: "Test Role",
                description: "Lorem Ipsum"
            }
            const expectedResult = {status: true, data: {affectedRows: 1, insertId: 9}}
            const result = await model.create(requestBody)

            expect(result.status).toEqual(expectedResult.status)
            expect(result.data).toEqual(expect.objectContaining(expectedResult.data))
        })
        test('Invalid Field should returning status false and error ER_BAD_FIELD_ERROR', async() => {
            const requestBody = {
                nameX: "Test Role",
                descriptionX: "Lorem Ipsum"
            }
            const expectedResult = {status: false, code: 'ER_BAD_FIELD_ERROR'}
            const result = await model.create(requestBody)

            expect(result).toEqual(expect.objectContaining(expectedResult))
        })
        test('Duplicate Entry should returning status false and error ER_DUP_ENTRY', async() => {
            const requestBody = {
                name: "Admin",
                description: "Lorem Ipsum"
            }
            const expectedResult = {status: false, code: 'ER_DUP_ENTRY'}
            const result = await model.create(requestBody)

            expect(result).toEqual(expect.objectContaining(expectedResult))
        })
    })
    describe('Test "findByPk" method', () => {
        test('Success should returning status true and data array', async() => {
            const id = 1
            const expectedResult = {status: true, data: [{id: 1, name: 'Admin'}]}
            const result = await model.findByPk(id)

            expect(result.status).toEqual(expectedResult.status)
            expect(result.data).toEqual(expect.arrayContaining(
                expectedResult.data.map(out => expect.objectContaining(out))
            ))
        })
        test('Not Found should returning status false and error ERR_NOT_FOUND', async() => {
            const id = 3333
            const expectedResult = {status: false, code: 'ERR_NOT_FOUND'}
            const result = await model.findByPk(id)

            expect(result).toEqual(expect.objectContaining(expectedResult))
        })
    })
    describe('Test "findAll" method', () => {
        test('Success should returning array of objects', async() => {

            const expectedResult = {status: true, data: [{id: 1, name: 'Admin'},{id: 2, name: 'Manager'}]}
            const result = await model.findAll()

            expect(result.status).toBe(true)
            expect(result.data).toEqual(expect.arrayContaining(expectedResult.data.map(out => expect.objectContaining(out))))
            expect(result.data.length).toBeLessThanOrEqual(10)
        })
    })
    describe('Test "findByKeys" method', () => {
        test('Success with single key should returning status true and array of object', async() => {

            const requestBody = {name: 'Admin'}
            const expectedResult = {status: true, data: [{id: 1, name: 'Admin'}]}
            const result = await model.findByKeys(requestBody)

            expect(result.status).toBe(true)
            expect(result.data).toEqual(expect.arrayContaining(expectedResult.data.map(out => expect.objectContaining(out))))
        })
        test('Success with multiple key should returning status true and array of object', async() => {

            const requestBody = {name:'Manag', description: 'transaction'}
            const expectedResult = {
                status: true,
                data: [{
                    id: 7,
                    name: "Social Management Officer",
                    description: "Handle social expanses transactions."
                },
                {
                    id: 8,
                    name: "Environmental Management Officer",
                    description: "Handle enviromental expanses transactions."
                }]
            }
            const result = await model.findByKeys(requestBody)

            expect(result.status).toBe(true)
            expect(result.data).toEqual(expect.arrayContaining(expectedResult.data.map(out => expect.objectContaining(out))))
        })
        test('Not found because "patternMatching = false" should returning status false and error ERR_NOT_FOUND', async() => {
            const requestBody = {name: 'Adm'}
            const expectedResult = {status: false, code: 'ERR_NOT_FOUND'}
            const result = await model.findByKeys(requestBody, false)

            expect(result).toEqual(expect.objectContaining(expectedResult))
        })
    })
    describe('Test "update" method', () => {
        test('Success should returning status true and affectedRows = 1', async() => {
            const requestBody = {
                id: 1,
                name: 'Updated Admin',
                description: 'This is updated using jest'
            }
            const expectedResult = {status: true, data: {affectedRows: 1}}
            const result = await model.update(requestBody)

            expect(result.status).toBe(true)
            expect(result.data).toEqual(expect.objectContaining(expectedResult.data))
        })
        test('Not Found should returning status false and code ER_NOT_FOUND', async() => {
            const requestBody = {
                id: 6879,
                name: 'Updated Admin',
                description: 'This is updated using jest'
            }
            const expectedResult = {status: false, code: 'ER_NOT_FOUND'}
            const result = await model.update(requestBody)

            expect(result).toEqual(expect.objectContaining(expectedResult))
        })
    })
    describe('Test "delete" method', () => {
        test('Success should returning status true and affectedRows = 1', async() => {
            const id = 7
            const expectedResult = {status: true, data: {affectedRows: 1}}
            const result = await model.delete(id)

            expect(result.status).toBe(true)
            expect(result.data).toEqual(expect.objectContaining(expectedResult.data))
        })
        test('Not Found should returning status false and error ER_NOT_FOUND', async() => {
            const id = 56489
            const expectedResult = {status: false, code: 'ER_NOT_FOUND'}
            const result = await model.delete(id)

            expect(result).toEqual(expect.objectContaining(expectedResult))
        })
        test('Delete Referenced ID should returning status false and error ER_ROW_IS_REFERENCED_2', async() => {
            const id = 1
            const expectedResult = {status: false, code: 'ER_ROW_IS_REFERENCED_2'}
            const result = await model.delete(id)

            expect(result).toEqual(expect.objectContaining(expectedResult))
        })
    })
    describe('Test "bulkOperation" method', () => {
        test('Bulk Create Success should return status true', async() => {
            const requestBody = [
                {
                    name: 'Test Bulk Create 1',
                    description: 'Lorem Ipsum'
                },{
                    name: 'Test Bulk Create 2',
                    description: 'Lorem Ipsum'
                }
            ]
            const expectedResult = {status: true, data: {affectedRows: 2}}
            const result = await model.bulkOperation('create', requestBody)

            expect(result.status).toBe(true)
            expect(result.data).toEqual(expect.objectContaining(expectedResult.data))
        })
        test('Bulk Create Failed or Partial Failed should return status false, error ER_PARTIAL_BULK_ENTRY, and list of error', async() => {
            const requestBody = [
                {
                    nameX: 'Test Bulk Create 3',
                    description: 'Lorem Ipsum'
                },{
                    name: 'Test Bulk Create 4',
                    descriptionX: 'Lorem Ipsum'
                }
            ]
            const expectedResult = {status: false, code: 'ER_PARTIAL_BULK_ENTRY', totalError: 2}
            const result = await model.bulkOperation('create', requestBody)

            expect(result).toEqual(expect.objectContaining(expectedResult))
        })
        test('Bulk Update Success should return status true', async() => {
            const requestBody = [
                {
                    id: 1,
                    name: 'Test Bulk Update 1',
                    description: 'Lorem Ipsum'
                },{
                    id: 2,
                    name: 'Test Bulk Update 2',
                    description: 'Lorem Ipsum'
                }
            ]
            const expectedResult = {status: true, data: {affectedRows: 2}}
            const result = await model.bulkOperation('update', requestBody)

            expect(result.status).toBe(true)
            expect(result.data).toEqual(expect.objectContaining(expectedResult.data))
        })
        test('Bulk Update Failed or Partial Failed should return status false, error ER_PARTIAL_BULK_ENTRY, and list of error', async() => {
            const requestBody = [
                {
                    idx: 1,
                    nameX: 'Test Bulk Update 3',
                    description: 'Lorem Ipsum'
                },{
                    ids: 2,
                    name: 'Test Bulk Update 4',
                    descriptionX: 'Lorem Ipsum'
                }
            ]
            const expectedResult = {status: false, code: 'ER_PARTIAL_BULK_ENTRY', totalError: 2}
            const result = await model.bulkOperation('update', requestBody)

            expect(result).toEqual(expect.objectContaining(expectedResult))
        })
    })

    afterAll(async () => {
        await pool.end()
        await db.end()
    })
})