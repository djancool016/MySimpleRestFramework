const {statusLogger} = require('./HttpLogger')

function mysqlErrCode(error){
    try {
        switch(error.code){
            case 'ER_ACCESS_DENIED_ERROR':
                return statusLogger({code: 403})
            case 'ER_INVALID_TOKEN':
                return statusLogger({code: 403, message: 'Invalid Token'})
            case 'ER_EXPIRED_TOKEN':
                return statusLogger({code: 403, message: 'Expired Token'})
            case 'ER_INVALID_CREDENTIAL':
                return statusLogger({code: 403, message: 'Invalid Credentials'})
            case 'ER_NO_TOKEN':
                return statusLogger({code: 403, message: 'No user token found'})
            case 'ER_BAD_DB_ERROR':
                return statusLogger({code: 404})
            case 'ER_NOT_FOUND':
                return statusLogger({code: 404})
            case 'ER_DUP_ENTRY':
                return statusLogger({code: 409, message: 'Duplicate Entry Error'})
            case 'ER_NO_SUCH_TABLE':
                return statusLogger({code: 404, message: 'Table Not Exist'})
            case 'ER_NO_DATA':
                return statusLogger({code: 404, message: 'Data Not Found'})
            case 'ER_PARSE_ERROR':
                return statusLogger({code: 400, message: 'Query Syntax Error'})
            case 'ER_INVALID_BODY':
                return statusLogger({code: 400, message: 'Invalid request body'})
            case 'ER_ROW_IS_REFERENCED_2':
                return statusLogger({code: 400, message: 'Cannot delete or update a parent row: a foreign key constraint fails'})
            case 'ER_CON_COUNT_ERROR':
                return statusLogger({code: 503, message: 'Service Unavailable - The maximum number of connections to the database has been reached'})
            case 'ER_DB_CREATE_EXISTS':
                return statusLogger({code: 409, message: 'The specified database already exists'})
            case 'ER_TABLE_EXISTS_ERROR':
                return statusLogger({code: 409, message: 'The specified table already exists'})
            case 'ER_LOCK_WAIT_TIMEOUT':
                return statusLogger({code: 503, message: 'Service Unavailable - Timeout waiting for a lock'})
            case 'ER_DATA_TOO_LONG':
                return statusLogger({code: 400, message: 'Data too long for column'})
            case 'ER_TRUNCATED_WRONG_VALUE':
                return statusLogger({code: 400, message: 'Truncated incorrect INTEGER value'})
            default:
                return statusLogger({code: 500})
        }
    } catch (error) {
        console.error('mysqlErrCode :' + error)
        return statusLogger({code: 500})
    }
}

module.exports = mysqlErrCode