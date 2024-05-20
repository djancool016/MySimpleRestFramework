const baseController = require('./base.controller')
const {statusLogger, dataLogger} = require('../utils/HttpLogger')
const mysqlErrHandler = require('../utils/MysqlErrorCode')
const CustomError = require('../utils/CustomError')
const UsersModel = require('../models/users.model')
const PasswordManager = require('../services/passwordManager.service')
const TokenManager = require('../services/tokenManager.service')
const model = new UsersModel()
const logging = require('../config').logging

async function authenticate(req, res, next, {payload, password, hash}, cookies = setCookies){
    try {
        // go to next middleware if error occured
        if(req.result?.status === false) return next()

        // compare user input password with hased password from database
        let isAuthenticated = await PasswordManager.compare(password, hash)
        
        if(!isAuthenticated) throw new CustomError('ER_INVALID_CREDENTIAL')
        
        // generate tokens
        const tokens = await TokenManager.authenticatedUser(payload)
        if(!tokens.refreshToken || !tokens.accessToken) throw new CustomError('ER_INVALID_TOKEN')

        // send token as Http-only cookies
        cookies(res, tokens)

        req.result = statusLogger({code: 200})

    } catch (error) {
        if(logging) console.error(error)
        req.result = mysqlErrHandler(error)
        return next()
    }
}
async function authorize(req, res, next){
    try {
        // go to next middleware if error occured
        if(req.result?.status === false) return next()

        // get accessToken from header
        let accessToken = req?.cookies?.accessToken
        if(!accessToken) throw new CustomError('ER_INVALID_TOKEN')

        // validate token and get payload
        const {id} = await TokenManager.verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET)
        
        // if accessToken invalid run token rotation
        if(!id) return await rotateToken(req, res, next) 

        // get user data from payload
        const user = await model.findByPk(id)
        if(!user.status) throw new CustomError('ER_NOT_FOUND')

        // add user data into request payload
        const {password, ...rest} = user.data[0]
        req.result = dataLogger({data: rest})

        // run next middleware
        return next()

    } catch (error) {
        if(logging) console.error(error)
        req.result = mysqlErrHandler(error)
        return next()
    }
}
async function rotateToken(req, res, next, cookies = setCookies){
    try {
        // go to next middleware if error occured
        if(req.result?.status === false) return next()

        // get refreshToken from header
        const refreshToken = req?.cookies?.refreshToken
        if(!refreshToken) throw new CustomError('ER_INVALID_TOKEN')

        // validate token and get payload
        const {id} = await TokenManager.verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        if(!id) throw new CustomError('ER_EXPIRED_TOKEN')

        // rotate tokens
        const tokens = await TokenManager.authenticatedUser({id})
        if(!tokens || Object.keys(tokens) < 1) throw new CustomError('ER_INVALID_TOKEN')
        
        // send token as Http-only cookies
        cookies(res, tokens)

        // authorize user using new rotated token
        return await authorize(req, res, next)

    } catch (error) {
        if(logging) console.error(error)
        req.result = mysqlErrHandler(error)
        return next()
    }
}

async function login(req, res, next){
    try {
        // go to next middleware if error occured
        if(req.result?.status === false) return next()

        const{username, password} = req.body

        // find username in the database
        const user = await model.findByKeys({username}, patternMatching = false)
        if(!user.status) throw new CustomError('ER_INVALID_CREDENTIAL')

        // authenticate user credential
        const {password: hash, ...rest} = user.data[0]
        await authenticate(req, res, next, {payload: rest, password, hash})
        if(req.result.status){
            // add user data into request payload
            req.result = dataLogger({data: rest})
            // run next middleware
            return next()
        }
        throw new CustomError('ER_ACCESS_DENIED_ERROR')

    } catch (error) {
        if(logging) console.error(error)
        req.result = mysqlErrHandler(error)
        return next()
    }
}
async function register(req, res, next){
    try {
        // go to next middleware if error occured
        if(req.result?.status === false) return next()

        // check request body
        if(Object.keys(req.body) < 1) throw new Error('ER_INVALID_BODY')

        // encrypt user password
        const {password} = req.body
        const hash = await PasswordManager.encrypt(password)
        req.body.password = hash

        // start register new user
        return await baseController.create(req, res, next, model)
        
    } catch (error) {
        if(logging) console.error(error)
        req.result = mysqlErrHandler(error)
        return next()
    }
}
async function logout(req, res, next){
    try {
        // go to next middleware if error occured
        if(req.result?.status === false) return next()

        // check if user already logout
        const refreshToken = req?.cookies?.refreshToken
        if(!refreshToken){
            req.result = statusLogger({code: 200, message: 'User already logged out'})
            return next()
        }

        const cookieKey = ['refreshToken','accessToken']

        cookieKey.forEach(key => {
            res.clearCookie(key, { httpOnly: true })
        })

        req.result = statusLogger({code: 200, message: 'Logged out'})

        return next()

    } catch (error) {
        if(logging) console.error(error)
        req.result = mysqlErrHandler(error)
        return next()
    }
}

async function update(req, res, next){
    try {
        // go to next middleware if error occured
        if(req.result?.status === false) return next()

        // check request body
        if(Object.keys(req.body) < 1) throw new CustomError('ER_INVALID_BODY')

        // make sure only authorized user can update data
        if(!req?.result?.data?.roleId) throw new CustomError('ER_ACCESS_DENIED_ERROR')

        // makse sure only admin (roleId = 1) can update other user data
        if(
            req.result.data.roleId != 1 && 
            req.body.id !== req.result.data.id
        ){
            throw new CustomError('ER_ACCESS_DENIED_ERROR')
        }

        // encrypt user password
        const {password} = req.body
        const hash = await PasswordManager.encrypt(password)
        req.body.password = hash

        // start register new user
        return await baseController.update(req, res, next, model)
        
    } catch (error) {
        if(logging) console.error(error)
        req.result = mysqlErrHandler(error)
        return next()
    }
}

function setCookies(res, tokens) {
    Object.entries(tokens).forEach(([tokenName, tokenValue]) => {
        res.cookie(tokenName, tokenValue, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        })
    })
}

const controller = (method) => (req, res, next) => baseController[method](req, res, next, model)

module.exports = {
    login, 
    logout,
    register,
    update,
    authorize,
    authenticate,
    rotateToken,
    read: controller('read'),
    destroy: controller('destroy'),
    sendResponse: baseController.sendResponse
}