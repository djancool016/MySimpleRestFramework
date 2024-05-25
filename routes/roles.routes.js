const router = require('express').Router()
const {roles, sendResponse} = require('../controllers')
const {users} = require('../controllers')

router.post('/', users.authorize, roles.create, sendResponse)
router.get('/', users.authorize, roles.read, sendResponse)
router.get('/:id', users.authorize, roles.read, sendResponse)
router.put('/', users.authorize, roles.update, sendResponse)
router.delete('/', users.authorize, roles.destroy, sendResponse)
router.delete('/:id', users.authorize, roles.destroy, sendResponse)

module.exports = router
