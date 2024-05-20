const controller = require('../../controllers/users.controller')
const TokenManager = require('../../services/tokenManager.service')
const {db, pool, truncateAll} = require('../../database').init()
const {seedTables} = require('../../seeders')

describe('Test Users Controller',() => {

    let res
    let next
    let payload
    let refreshTokenSecret
    let refreshToken

    beforeAll(async () => {
        await db.connect().then(async db => {
            await truncateAll(db)
            await seedTables(db)
        })
        res = {cookie: () => {}}
        next = () => {}
        payload = {
            id: 1,
            username: 'DwiJ',
            roleId: 1
        }
        refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET
        refreshToken = await TokenManager.generateToken(payload, refreshTokenSecret)
    })
    describe('Test "authenticate" function', () => {
        test('Valid password return http code 200', async () => {
            const req = {body: {}}
            const data = {
                payload: {id: 1, username:'John Doe'},
                password: 'root',
                hash: '$2b$10$6mDs.1WWdji41IYYRi9KGeL7yI69dV3OsL62HF46sb6TJ2XLyZX/K'
            }
            const expectedResult = {status: true, code: 200}
            await controller.authenticate(req, res, next, data)

            expect(req.result?.code).toBe(expectedResult.code)
        })
        test('Invalid password return http code 403', async () => {
            const req = {body: {}}
            const data = {
                payload: {id: 1, username:'John Doe'},
                password: 'invalid password',
                hash: '$2b$10$6mDs.1WWdji41IYYRi9KGeL7yI69dV3OsL62HF46sb6TJ2XLyZX/K'
            }
            const expectedResult = {status: false, code: 403}
            await controller.authenticate(req, res, next, data)

            expect(req.result?.code).toBe(expectedResult.code)
        })
    })
    describe('Test "authorize" function', () => {
        test('Authorized user should return http code 200 and user data', async() => {
            // define request header
            const req = {cookies: {refreshToken}}

            // function store token inside request header
            const setCookies = (res, tokens) => {
                Object.entries(tokens).forEach(([tokenName, tokenValue]) => {
                    req.cookies[tokenName] = tokenValue
                })
            }

            // generate new access token using refresh token
            await controller.rotateToken(req, res, next, setCookies)

            // start authorize user using access token
            await controller.authorize(req, res, next)

            expect(req.result.status).toBe(true)
            expect(req.result.data).toEqual(expect.objectContaining({id: 1}))
            expect(req.result.code).toBe(200)
            expect(req.cookies.accessToken).toBeDefined()

        })
        test('Unauthorized user should return http code 403', async() => {
            const req = {}
            // start authorize user using access token
            await controller.authorize(req, res, next)

            expect(req.result.status).toBe(false)
            expect(req.result.code).toBe(403)
        })
    })

    describe('Test "rotateToken" function', () => {
        test('Token Rotation should return code 200 and cookies contain tokens', async() => {
            const req = {cookies: {refreshToken}}
            const expectedResult = {status: true, code: 200}
            const setCookies = (res, tokens) => {
                Object.entries(tokens).forEach(([tokenName, tokenValue]) => {
                    req.cookies[tokenName] = tokenValue
                })
            }
            await controller.rotateToken(req, res, next, setCookies)

            expect(req.result?.code).toBe(expectedResult.code)
            expect(req.cookies.refreshToken).toBeDefined()
            expect(req.cookies.accessToken).toBeDefined()
        })
        test('Unauthorized user (no token) should return code 403', async() => {
            const req = {cookies: {}}
            const expectedResult = {status: false, code: 403}
            const setCookies = (res, tokens) => {
                Object.entries(tokens).forEach(([tokenName, tokenValue]) => {
                    req.cookies[tokenName] = tokenValue
                })
            }
            await controller.rotateToken(req, res, next, setCookies)

            expect(req.result?.code).toBe(expectedResult.code)
        })
    })

    describe('Test "login" function', () => {
        test('Valid credentials should return http code 200 and user data', async() => {
            const req = {body: {username: 'admin', password: 'root'}}
            const expectedResult = {status: true, code: 200, data:{id: 1, name:'Dwi Julianto'}}
            await controller.login(req, res, next)

            expect(req.result?.code).toBe(expectedResult.code)
            expect(req.result?.data).toEqual(expect.objectContaining(expectedResult.data))
        })
        test('Invalid username should return http code 403', async() => {
            const req = {body: {username: 'adMin', password: 'root'}}
            const expectedResult = {status: false, code: 403}
            await controller.login(req, res, next)

            expect(req.result?.code).toBe(expectedResult.code)
        })
        test('Invalid password should return http code 403', async() => {
            const req = {body: {username: 'admin', password: 'roots'}}
            const expectedResult = {status: false, code: 403}
            await controller.login(req, res, next)

            expect(req.result?.code).toBe(expectedResult.code)
        })
    })
    describe('Test "register" function', () => {
        test('Successfull register shoud return http code 200', async() => {
            const req = {body: {
                username: 'Test User',
                password: 1234,
                name: 'John Doe',
                phone: 321401234,
                roleId: 2,
                nik: 123901284,
                email: 'John@Email.com'
            }}
            const expectedResult = {status: true, code: 201, data:{affectedRows: 1}}
            await controller.register(req, res, next)

            expect(req.result.status).toBe(expectedResult.status)
            expect(req.result.code).toBe(expectedResult.code)
            expect(req.result.data).toEqual(expect.objectContaining(expectedResult.data))

        })
        test('Invalid body should return http code 400', async() => {
            const req = {body: {
                usernameX: 'Test User',
                password: 1234,
                nameX: 'John Doe',
                phone: 321401234,
                roleId: 2,
                nikX: 123901284,
                email: 'John@Email.com'
            }}
            const expectedResult = {status: false, code: 400}
            await controller.register(req, res, next)

            expect(req.result.status).toBe(expectedResult.status)
            expect(req.result.code).toBe(expectedResult.code)
        })
    })

    describe('Test "update" function', () => {
        test('Succsess update should return code 200 and data.affectedRows', async() => {
            const req = {
                body: {id: 1, name: 'Juliant Dwyne'},
                result: {status: true, code: 200, data: {id: 1, roleId: 1}}
            }
            const expectedResult = {status: true, code: 200, data:{affectedRows: 1}}

            await controller.update(req, res, next)

            expect(req.result.status).toBe(expectedResult.status)
            expect(req.result.code).toBe(expectedResult.code)
            expect(req.result.data).toEqual(expect.objectContaining(expectedResult.data))
        })
        test('Unathourized user should return code 403', async() => {
            const req = {
                body: {id: 1, name: 'Juliant Dwyne'},
                result: {status: false, code: 403}
            }
            const expectedResult = {status: false, code: 403}

            await controller.update(req, res, next)

            expect(req.result.status).toBe(expectedResult.status)
            expect(req.result.code).toBe(expectedResult.code)
        })
        test('Update other user data with unathourized role ID should return code 403', async() => {
            const req = {
                body: {id: 1, name: 'Juliant Dwyne'},
                result: {status: true, code: 200, data:{roleId: 2}}
            }
            const res = {clearCookie: (key) => {
                delete req[key]
            }}
            const expectedResult = {status: false, code: 403}

            await controller.update(req, res, next)

            expect(req.result.status).toBe(expectedResult.status)
            expect(req.result.code).toBe(expectedResult.code)
        })
    })
    describe('Test "logout" function', () => {
        test('Successfull should return http code 200', async() => {
            const req = {cookies: {refreshToken}}
            const res = {clearCookie: (key) => delete req.cookies[key]}
            const expectedResult = {status: true, code: 200}
            await controller.logout(req, res, next)

            expect(req.result.status).toBe(expectedResult.status)
            expect(req.result.code).toBe(expectedResult.code)
        })
        test('No token should return http code 200', async() => {
            const req = {cookies: {}}
            const expectedResult = {status: true, code: 200}
            await controller.logout(req, res, next)

            expect(req.result.status).toBe(expectedResult.status)
            expect(req.result.code).toBe(expectedResult.code)
        })
    })

    afterAll(async () => {
        await pool.end()
        await db.end()
    })
})