const router = require('express').Router()
const logging = require('../config').logging

function errRoute(err, req, res, next){
    if(logging) console.error(err)
    res.status(err.status || 500).json(err)
}

router.use('/roles', require('./roles.routes'))
router.use('/users', require('./users.routes'))

module.exports = {router, errRoute}