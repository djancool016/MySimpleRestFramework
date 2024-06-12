const axios = require('axios')
const logging = require('../config').logging
const mysqlErrHandler = require('../utils/MysqlErrorCode')

async function axiosPost(
    req, next, url, header = {headers: {'Content-Type': 'application/json'}}
){
    try {
        // send request
        const response = await axios.post(url, req.body || req.query || req.params, header)
        //console.log(response.headers["set-cookie"])
        // store result in req object
        req.result = resultHandler(response)

        // begin next middleware
        return next()

    } catch (error) {

        if(logging) console.error({
            code: error.code || 500, 
            message: error.message || 'Internal Server Error'
        })

        const err = req.result = mysqlErrHandler(error.code)

        return next(err)
    }
}

async function axiosGet(req, next, url, header){
    try {
        // send request
        const response = await axios.get(url, header)

        // store result in req object
        req.result = resultHandler(response)

        // begin next middleware
        return next()
        
    } catch (error) {

        if(logging) console.error({
            code: error.code || 500, 
            message: error.message || 'Internal Server Error'
        })

        const err = req.result = mysqlErrHandler(error.code)

        return next(err)
    }
}

function resultHandler(response){
    return response.data || statusLogger({code: response.code, message: response.statusText})
}

module.exports = {axiosGet, axiosPost}