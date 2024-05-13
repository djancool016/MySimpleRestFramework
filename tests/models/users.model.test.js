const {UsersModel} = require('../../models')
const {db, pool, truncateAll} = require('../../database').init()
const {seedTables} = require('../../seeders')

describe('Test join table UsersModel and RolesModel', () => {

    let model

    beforeAll(async () => {
        await db.connect().then(async db => {
            await truncateAll(db)
            await seedTables(db)
        })
        model = new UsersModel()
    })
    describe('Test CREATE method', () => {
        test('Read user should returning status True and data.affectedRows = 1', async() => {
            const requestBody = {
                username: 'Test User',
                password: 1234,
                name: 'John Doe',
                phone: 321401234,
                roleId: 2,
                nik: 123901284,
                email: 'John@Email.com'
            }
            const expectedResult = {status: true, data: {affectedRows: 1}}
            const result = await model.create(requestBody)

            expect(result.status).toBe(true)
            expect(result.data).toEqual(expect.objectContaining(expectedResult.data))
        })
    })
    describe('Test READ method', () => {
        test('Read user should should lncluding data from Roles table', async() => {
            const requestBody = {id: 1}
            const expectedResult = {status: true, data: [{id: 1, role: 'Admin'}]}
            const result = await model.findByKeys(requestBody)

            expect(result.status).toBe(true)
            expect(result.data).toEqual(expect.arrayContaining(
                expectedResult.data.map(out => expect.objectContaining(out))
            ))
        })
    })
    describe('Test UPDATE method', () => {
        test('Read user should should lncluding data from Roles table', async() => {
            const requestBody = {id: 1, name: 'Juliant Dwyne'}
            const expectedResult = {status: true, data: {affectedRows: 1}}
            const result = await model.update(requestBody)

            expect(result.status).toBe(true)
            expect(result.data).toEqual(expect.objectContaining(expectedResult.data))
        })
    })
    describe('Test DELETE method', () => {
        test('Read user should inscluding status True and data.affectedRows = 1', async() => {
            const id = 2
            const expectedResult = {status: true, data: {affectedRows: 1}}
            const result = await model.delete(id)

            expect(result.status).toBe(true)
            expect(result.data).toEqual(expect.objectContaining(expectedResult.data))
        })
    })

    afterAll(async () => {
        await pool.end()
        await db.end()
    })
})