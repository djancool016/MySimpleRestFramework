const router = require('express').Router()
const {status, sendResponse} = require('../controllers')

router.post('/', status.create, sendResponse)
router.get('/', status.read, sendResponse)
router.get('/:id', status.read, sendResponse)
router.put('/', status.update, sendResponse)
router.delete('/:id', status.destroy, sendResponse)

module.exports = router
