require('dotenv').config()
const TokenManager = require('../../services/tokenManager.service')

describe('Token Manager', () => {

    let payload
    let refreshTokenSecret
    let refreshToken
    let accessToken
    let error

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

    beforeAll(async () => {
        payload = {
            username: 'DwiJ',
            roleId: 1
        }
        refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET
        refreshToken = await TokenManager.generateToken(payload, refreshTokenSecret)
    })

    test('Test creating token using payload and secret should returning string token', async () => {

        expect(typeof(refreshToken)).toBe('string')
    })

    test('Test to verify token secret should returning payload', async () => {

        const payload = await TokenManager.verifyToken(refreshToken, refreshTokenSecret)
        expect(payload).toEqual(expect.objectContaining(payload))
    })

    test('Test authenticatedUser should returning refresh token & access token', async () => {

        const payload = {id: 9999, username: 'Dwij'}
        const tokens = await TokenManager.authenticatedUser(payload)

        refreshToken = tokens.refreshToken
        accessToken = tokens.accessToken

        expect(typeof(refreshToken)).toBe('string')
        expect(typeof(accessToken)).toBe('string')

    })
    
    test('Test token rotation from valid access token sould generate new refresh & access token', async () => {

        const newTokens = await TokenManager.tokenRotation(accessToken)
        
        expect(newTokens.refreshToken).toBeDefined()
        expect(newTokens.accessToken).toBeDefined()

        expect(typeof(newTokens.refreshToken)).toBe('string')
    })

    test('Test token rotation from expired access token sould throw error', async () => {
        
        // generate access token
        const payload = {id: 1, username: 'Dwi J'}
        const tokenLifeTime = 1 // in second
        accessToken = await TokenManager.generateToken(payload, process.env.ACCESS_TOKEN_SECRET, tokenLifeTime)

        await wait(1000)

        try {
            await TokenManager.tokenRotation(accessToken)
        } catch (err) {
            error = err
        }

        expect(error).toBeDefined()
        expect(error.message).toContain('TokenExpiredError: jwt expired')
    })

    test('Test if refresh token is expired in 1 second should returning error', async () => {

        // generate new token
        const payload = {id: 1, username: 'Dwi J'}
        const tokenLifeTime = 1 // in second
        refreshToken = await TokenManager.generateToken(payload, process.env.REFRESH_TOKEN_SECRET, tokenLifeTime)

        await wait(1000)
        
        try {
            await TokenManager.verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        } catch (err) {
            error = err
        }

        expect(error).toBeDefined()
        expect(error.message).toContain('TokenExpiredError: jwt expired')

    })

    afterAll(async () => {
        
    })
})