const {statusLogger, dataLogger} = require('../../utils/HttpLogger')

describe('Test HTTP Status Logger', () => {
    test('should return status code 200', () => {
        const result = statusLogger({code: 200})

        expect(result.status).toBe(true)
        expect(result.code).toBe(200)
        expect(result.message).toBe('Ok')
    })
    test('should return status code 404', () => {
        const result = statusLogger({code: 404})

        expect(result.status).toBe(false)
        expect(result.code).toBe(404)
        expect(result.message).toBe('Not Found')
    })
    test('invalid code should return status code 500', () => {
        const result = statusLogger({code: 9999})

        expect(result.status).toBe(false)
        expect(result.code).toBe(500)
        expect(result.message).toBe('Invalid HTTP Code')
    })
    test('empty http code should return status code 500', () => {
        const result = statusLogger({})

        expect(result.status).toBe(false)
        expect(result.code).toBe(500)
        expect(result.message).toBe('Empty HTTP Code')
    })
})

describe('TEST HTTP Data Logger', () => {
    test('should return status 200 and an object', () => {
        const result = dataLogger({data: {id: 1, name: 'John Doe'}})

        expect(result.status).toBe(true)
        expect(result.code).toBe(200),
        expect(result.data).toBeDefined()
    })
    test('empty object should return status 404', () => {
        const result = dataLogger({data: undefined})

        expect(result.status).toBe(false)
        expect(result.code).toBe(404)
    })
})