const {pool} = require('../database').init()
const poolConnection = pool.createPool()
const loging = false

class BaseModel {

    constructor(queryBuilder){
        this.queryBuilder = queryBuilder
        this.loging = loging
    }

    async create(requestBody){
        try {
            const {query, param} = this.queryBuilder.create(requestBody)

            const result = await executeMysqlQuery(query, param)
            return resultHandler({data: result})

        } catch (error) {
            const err = {
                code: error.code,
                message: error.message
            }
            if(this.loging) console.error('BaseModel.create error', err)
            return resultHandler(err)
        }
    }
    async findByPk(id){

        try {
            const {query, param} = this.queryBuilder.readByPk({id})

            const result = await executeMysqlSelect(query, param)
            if(result.length == 0) return resultHandler({
                status: false,
                code: 'ERR_NOT_FOUND', 
                message: 'data not found'
            })
            return resultHandler({data: result})

        } catch (error) {
            const err = {
                code: error.code,
                message: error.message
            }
            if(this.loging) console.error('BaseModel.findByPk error', err)
            return resultHandler(err)
        }
    }
    async findAll(requestBody){
        
        try {

            const {query, param} = this.queryBuilder.readAll(requestBody)

            const result = await executeMysqlSelect(query, param)
            if(result.length == 0) return resultHandler({
                status: false,
                code: 'ERR_NOT_FOUND', 
                message: 'data not found'
            })
            return resultHandler({data: result})

        } catch (error) {
            const err = {
                code: error.code,
                message: error.message
            }
            if(this.loging) console.error('BaseModel.findAll error', err)
            return resultHandler(err)
        }
    }
    async findByKeys(requestBody, patternMatching = true){
        
        try {
            const {query, param} = this.queryBuilder.readByKeys(requestBody, patternMatching)

            const result = await executeMysqlSelect(query, param)

            if(result.length == 0) return resultHandler({
                status: false,
                code: 'ERR_NOT_FOUND', 
                message: 'data not found'
            })
            return resultHandler({data: result})

        } catch (error) {
            const err = {
                code: error.code,
                message: error.message
            }
            if(this.loging) console.error('BaseModel.findByKeys error', err)
            return resultHandler(err)
        }

    }
    async update(requestBody){

        try {
            const {query, param} = this.queryBuilder.update(requestBody)

            const result = await executeMysqlQuery(query, param)
            if(result.affectedRows == 0){
                const error = new Error('Not Found')
                error.code = 'ER_NOT_FOUND'
                error.message = 'Data not found'
                throw error 
            }
            return resultHandler({data: result})

        } catch (error) {
            if(error.message.includes('Bind parameters must not contain undefined')){
                error.code = 'ER_BAD_FIELD_ERROR'
            }
            const err = {
                code: error.code,
                message: error.message
            }
            if(this.loging) console.error('BaseModel.update error', err)
            return resultHandler(err)
        }
    }
    async delete(id){
        try {
            const {query, param} = this.queryBuilder.delete({id})

            const result = await executeMysqlQuery(query, param)

            if(result.affectedRows == 0){
                const error = new Error('Not Found')
                error.code = 'ER_NOT_FOUND'
                error.message = 'Data not found'
                throw error 
            }
            return resultHandler({data: result})

        } catch (error) {
            const err = {
                code: error.code,
                message: error.message
            }
            if(this.loging) console.error('BaseModel.findAll error', err)
            return resultHandler(err)
        }
    }

    async bulkOperation(operation, requestBody = []) {
        const errorList = []
        let successCount = 0
    
        try {
            if (!Array.isArray(requestBody)) {
                throw new Error('Invalid request body: expected an array');
            }
    
            await Promise.all(requestBody.map(async body => {
                const result = await this[operation](body)
                if (result.status){
                    successCount++
                }else{
                    result['errorBody'] = body
                    errorList.push(result)
                }
            }))
    
            if (errorList.length == 0) {
                return {
                    status: true,
                    data: { affectedRows: successCount }
                }
            }
    
            throw new Error('Bulk Operation Error')
    
        } catch (error) {
            const err = {
                status: false,
                code: error.code || 'ER_PARTIAL_BULK_ENTRY',
                message: '',
                totalError: errorList.length,
                errorList: errorList
            }
    
            if (error.message !== 'Bulk Operation Error') {
                err.message = error.message;
            } else {
                if (requestBody.length === errorList.length) {
                    err.message = `All of ${operation} operation is terminated`;
                } else {
                    err.message = `Part of ${operation} operation is terminated`;
                }
            }
    
            if(this.loging) console.error('BaseModel.bulkOperation error', err)
            return err
        }
    }
}

function resultHandler({data, message = '', code = ''}){
    return data
        ? { status: true, message: message || 'success', data }
        : { status: false, 
            message: message || 'unknown error', 
            code: code || 'unknown code'
        }
}

// execute query
async function executeMysqlQuery(query, params = []){
    const [result] = await poolConnection.execute(query, params)
    return result
} 
// execute SELECT query
async function executeMysqlSelect(query, params = []){
    const [rows] = await poolConnection.execute(query, params)
    return rows
} 

module.exports = BaseModel
  