const router = require('express').Router()
const {users, sendResponse} = require('../controllers')

router.post('/login', users.login, sendResponse)
router.post('/logout', users.logout, sendResponse)
router.post('/register', users.register, sendResponse)
router.post('/auth', users.authorize, sendResponse)
router.put('/', users.authorize, users.update, sendResponse)

module.exports = router
