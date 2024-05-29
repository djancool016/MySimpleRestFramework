const router = require('express').Router()
const {loan, sendResponse} = require('../controllers')

router.post('/', loan.create, sendResponse)
router.get('/', loan.read, sendResponse)
router.get('/:id', loan.read, sendResponse)
router.put('/', loan.update, sendResponse)
router.delete('/:id', loan.destroy, sendResponse)

module.exports = router
