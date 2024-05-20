require('dotenv').config()
const PasswordManager = require('../../services/passwordManager.service')

describe('PasswordManager', () => {

    let password
    let hash

    beforeAll(async () => {
        password = 'testvalidpassword'
        hash = await PasswordManager.encrypt(password)
    })

    test('Test password encryption should returning string hash', async () => {

        expect(typeof(hash)).toBe('string')
    })

    test('Test compare correct password with hashed password should returning true', async () => {

        const result = await PasswordManager.compare(password, hash)
        expect(result).toBe(true)
    })

    test('Test compare wrong password with hashed passwod should returning false', async () => {

        const invalidPassword = 'invalidpassword'
        const result = await PasswordManager.compare(invalidPassword, hash)
        expect(result).toBe(false)
    })

    afterAll(async () => {
        
    })
})