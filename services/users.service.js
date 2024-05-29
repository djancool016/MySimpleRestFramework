require('dotenv').config()
const axios = require('axios')
const CustomError = require('../utils/CustomError')
const url = process.env.USER_MANAGEMENT_API_URL
const logging = require('../config').logging
const mysqlErrHandler = require('../utils/MysqlErrorCode')

async function findByPk(id){
    try {
        if(!id) throw new CustomError('ER_NOT_FOUND')

        const user = await axios.get(`${url}/users/${id}`)

        if(!user.status) throw new CustomError('ER_NOT_FOUND')

        return user

    } catch (error) {
        
        if(logging) console.error(error)

        throw mysqlErrHandler(error)
    }
}