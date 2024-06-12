require('dotenv').config()
const api = process.env.USER_MANAGEMENT_API_URL
const {axiosGet, axiosPost} = require('./base.service')


async function checkApi(req, res, next, header) {
    const url = `${api}/health`
    return await axiosGet(req, next, url, header)
}

async function login(req, res, next, header){
    const url = `${api}/users/login`
    return await axiosPost(req, next, url, header)
}

async function authorize(req, res, next, header){
    const url = `${api}/users/auth`
    return await axiosPost(req, next, url, header)
}

async function findByPk(req, res, next, header){
    const id = req.body?.userId
    const url = `${api}/users/${id}`
    return await axiosGet(req, next, url, header)
}

module.exports = {
    checkApi, login, authorize, findByPk
}