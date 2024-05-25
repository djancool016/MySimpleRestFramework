const {statusLogger, dataLogger} = require('../utils/HttpLogger')
const mysqlErrHandler = require('../utils/MysqlErrorCode')
const CustomError = require('../utils/CustomError')
const logging = require('../config').logging

async function create(req, res, next, model){
    if(req.result?.status === false) return next()
    
    try {
        if(requestType(req) !== 'body') throw new CustomError('ER_INVALID_BODY')

        const result = await model.create(req.body)

        if(result.status){
            req.result = dataLogger({code: 201, data: result.data})
        }else {
            throw result
        }
        // Continue to next middleware
        return next()
        
    } catch (error) {
        if(logging) console.error(error)
        req.result = mysqlErrHandler(error)
        return next()
    }
}
async function read(req, res, next, model){
    if(req.result?.status === false) return next()

    try {

        let result 

        switch(requestType(req)){
            case 'query':
                result = await model.findByKeys(req.query)
                break
            case 'params':
                result = await model.findByPk(req.params.id)
                break
            case 'body':
                result = await model.findByKeys(req.body) 
                break
            case 'empty':
                result = await model.findAll()
                break
            default:
                throw new CustomError('ER_INVALID_BODY')
        }

        if(result.status){
            req.result = dataLogger({data: result.data})
        }else{
            throw result
        }

        return next()

    } catch (error) {
        if(logging) console.error(error)
        req.result = mysqlErrHandler(error)
        return next()
    }
}
async function update(req, res, next, model){
    if(req.result?.status === false) return next()
    
    try {
        const result = await model.update(req.body) 

        if(result.data){
            req.result = dataLogger({data: result.data})
        }else{
            throw result
        }
        return next()

    } catch (error) {
        if(logging) console.error(error)
        req.result = mysqlErrHandler(error)
        return next()
    }
}
async function destroy(req, res, next, model){
    if(req.result?.status === false) return next()
    
    try {

        let id

        switch(requestType(req)){
            case 'query':
                id = req.query.id
                break
            case 'params':
                id = req.params.id
                break
            case 'body':
                id = req.body.id
                break
            default:
                throw new CustomError('ER_INVALID_BODY')
        }
        const result = await model.delete(id)

        if(result.data){
            req.result = dataLogger({data: result.data})
        }else{
            throw result
        }
        return next()


    } catch (error) {
        if(logging) console.error(error)
        req.result = mysqlErrHandler(error)
        return next()
    }
}
/**
 * Sends response based on request result.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
function sendResponse(req, res) {
    if(req.result){
        res.status(req.result.code).json(req.result)
    }else {
        res.status(500).json(statusLogger({
            code: 500, 
            message:'BaseControllerBadResponse'
        }))
    }
}

function requestType(req) {
    if (Array.isArray(req.body)) {
        return 'body_array'
    } else if (typeof req.body === 'object' && req.body !== null && Object.keys(req.body).length > 0) {
        return 'body'
    } else if (typeof req.params === 'object' && req.params !== null && Object.keys(req.params).length > 0){
        return 'params'
    } else if (typeof req.query === 'object' && req.query !== null && Object.keys(req.query).length > 0){
        return 'query'
    } else if (Object.keys(req.body).length === 0) {
        return 'empty'
    } else {
        return 'unknown'
    }
}

module.exports = {
    create, read, update, destroy, sendResponse
}
