const router = require('express').Router()
const {loanPayment, sendResponse} = require('../controllers')

router.post('/', loanPayment.create, sendResponse)
router.get('/', loanPayment.read, sendResponse)
router.get('/:id', loanPayment.read, sendResponse)
router.put('/', loanPayment.update, sendResponse)
router.delete('/:id', loanPayment.destroy, sendResponse)

module.exports = router
