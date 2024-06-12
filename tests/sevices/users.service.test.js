const ServiceTester = require('./tester.service')

const refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzE3NDg2MTE3LCJleHAiOjE3MTc1NzI1MTd9.fJR5rw1P4vRF1Yg-oCEXovN-47jQvsWeCQK4gGl5spQ; Path=/; HttpOnly; Secure; SameSite=Strict'
const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImlhdCI6MTcxNzQ4NjExNywiZXhwIjoxNzE3NDg5NzE3fQ.kAowKOwyovNe6ffXVjT3tvMvjCJUrkJU6SiBmClV-aI; Path=/; HttpOnly; Secure; SameSite=Strict'

const header = {headers: {'Content-Type': 'application/json'}}
const headerWithToken = {
    headers: {
        'Content-Type': 'application/json',
        'Cookie': `refreshToken=${refreshToken}; accessToken=${accessToken}`
    }
}

const testObj = {
    checkApi: [
        {
            header,
            req: {body: {}},
            output: {status: true, code: 200},
            description: 'Connected to users api should return http code 200'
        }
    ],
    login: [
        {
            header,
            req: {body: {username: 'admin', password: 'root'}},
            output: {status: true, code: 200, data:{id: 1, name:'Dwi Julianto'}},
            description: 'Authenticated user should return user data'
        }
    ],
    authorize: [
        {
            header: headerWithToken,
            req: {},
            output: {status: true, code: 200, data: {id: 1, name:'Dwi Julianto'}},
            description: 'Authorized user should return user data'
        }
    ],
    findByPk: [
        {
            header: headerWithToken,
            req: {body: {userId: 1}},
            output: {status: true, code: 200, data: [{id: 1, name:'Dwi Julianto'}]},
            description: 'Success user should return user data'
        }
    ]
}
const modules = require('../../services/users.service')
const test = new ServiceTester(testObj, modules)

test.runTest()