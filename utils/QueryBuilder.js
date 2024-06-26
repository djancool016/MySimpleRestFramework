const logging = require('../config').logging

class QueryBuilder {
    constructor({table = '', includes = [], alias = [], association = []}){
        this.table = table
        this.select = selectBuilder({table, includes, alias, association}) || ''
        this.join = joinBuilder({association}) || ''
        this.where = (requestBody, patternMatching = true) => {
            return whereBuilder({table, includes, association}, requestBody, patternMatching) || ''
        }
        this.paging = (requestBody) => {
            return pagingBuilder(requestBody) || ''
        }
       
    }
    create(requestBody){
        try {
            // extract keys and values from object data
            const keys = Object.keys(requestBody)

            // create placeholder for the values
            const placeholders = keys.map(() => '?').join(', ')

            return {
                query: `INSERT INTO ${this.table} (${keys.join(', ')}) VALUES (${placeholders})`,
                param: paramsBuilder(requestBody, [], false, false)
            }
        } catch (error) {
            if(logging) console.error(error)
            throw queryErrorHandler(error)
        }
    }
    readByPk(requestBody){
        try {
            return {
                query: `SELECT ${this.select} FROM ${this.table} ${this.join} WHERE ${this.table}.id = ?`,
                param: [requestBody.id]
            }
        } catch (error) {
            if(logging) console.error(error)
            throw queryErrorHandler(error)
        }
    }
    readAll(requestBody){
        try {
            const paging = this.paging(requestBody)
            return {
                query: `SELECT ${this.select} FROM ${this.table} ${this.join} ${paging}`,
                param: []
            }
        } catch (error) {
            if(logging) console.error(error)
            throw queryErrorHandler(error)
        }
    }
    readByKeys(requestBody, patternMatching = true){
        try {
            const where = this.where(requestBody, patternMatching)
            const paging = this.paging(requestBody)
            const binary = !patternMatching ? 'BINARY' : ''

            return {
                query: `SELECT ${this.select} FROM ${this.table} ${this.join} WHERE ${binary} ${where} ${paging}`,
                param: paramsBuilder(requestBody, [], true, patternMatching)
            }

        } catch (error) {
            if(logging) console.error(error)
            throw queryErrorHandler(error)
        }
    }
    update(requestBody){
        try {
            const {id, ...data} = requestBody

            // extract keys and values from object data
            const keys = Object.keys(data)
            const params = paramsBuilder(requestBody, ['id'], false, false)
            params.push(id)

            // construct placeholder for updated columns
            const placeholder = keys.map(key => `${key} = ?`).join(', ')

            return {
                query: `UPDATE ${this.table} SET ${placeholder} WHERE ${this.table}.id = ?`,
                param: params
            }

        } catch (error) {
            if(logging) console.error(error)
            throw queryErrorHandler(error)
        }
    }
    delete(requestBody){
        try {
            return {
                query: `DELETE FROM ${this.table} WHERE ${this.table}.id = ?`,
                param: [requestBody.id]
            }
        } catch (error) {
            if(logging) console.error(error)
            throw queryErrorHandler(error)
        }
    }
}
function paramsBuilder(requestBody, excludedKeys = [], allowedArrayValue = false, patternMatching = true) {
    // Extract keys and values from object data
    const keys = Object.keys(requestBody)
    const params = keys
        .filter(key => !excludedKeys.includes(key)) // Exclude keys present in excludedKeys
        .flatMap(key => {
            const value = requestBody[key]
            if(Array.isArray(value) && allowedArrayValue){
                return value
            }else if(patternMatching && typeof value === 'string'){
                return [`%${value}%`]
            }else{
                return [value]
            }
        })

    return params
}

function queryErrorHandler(error){
    const err = new Error('QueryBuilder Error')
    err.code = error.code || 'ER_QUERY_BUILDER'
    err.message = error.message || 'Unknown Error'
    return err
}

function selectBuilder({table, includes, alias, association = []}){
    
    const queries = []

    const selectQuery = (table, includes, alias) => {
        if(includes.length > 0){
            return includes.map(column => {
                // If the column exists in the alias object, use the alias value, otherwise use the column itself
                if(column && alias && alias[column]){
                    return `${table}.${column} AS ${alias[column]}`
                }else{
                    return `${table}.${column}`
                }
            }).join(', ')
        } 
        return `${table}.*`
    }

    queries.push(selectQuery(table, includes, alias))

    if(association && Array.isArray(association) && association.length > 0){
        association.forEach( assoc => {
            const {table, includes, alias} = assoc
            queries.push(selectQuery(table, includes, alias))
        })
    }

    return queries.join(', ')
}

function joinBuilder({association}) {

    if (!association || association.length === 0) return ''

    return association.map(({ table, foreignKey, references, joinType }) =>{
        const join = joinType ? joinType : 'INNER JOIN'
        return `${join} ${table} ON ${foreignKey} = ${references}`
    }).join(' ')
    
}

function whereBuilder({table, includes, association}, requestBody, patternMatching = false) {

    const includedKeys = []
    const query = (includes) => includes.forEach( key => {
        const value = requestBody[key]
        let operation
        if (value) {
            if(Array.isArray(value)){
                const placeholder = value.map(() => '?').join(',')
                operation = `IN (${placeholder})`
            }else if(typeof value === 'string' && value.length > 2 && patternMatching){
                operation = 'LIKE ?'
            }else{
                operation = '= ?'
            }
            if(value.length !== 0) includedKeys.push(`${table}.${key} ${operation}`)
        }
    })
    if(includes) query(includes)

    association.forEach(assoc => {
        if(assoc.includes) return query(assoc.includes)
    })
    return includedKeys.join(' AND ')
}

function pagingBuilder(requestBody){
    
    const page = requestBody?.page || 1
    const pageSize = requestBody?.pageSize || 10

    const limit = pageSize
    const offset = (page - 1) * (pageSize)
    
    return `LIMIT ${limit} OFFSET ${offset}`
}

module.exports = QueryBuilder