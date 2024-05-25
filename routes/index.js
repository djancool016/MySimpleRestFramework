const router = require('express').Router()

router.use('/roles', require('./roles.routes'))
router.use('/users', require('./users.routes'))

module.exports = router