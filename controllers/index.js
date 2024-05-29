const { sendResponse } = require('./base.controller');

module.exports = {
    status: require('./status.controller'),
    loan: require('./loan.controller'),
    loanPayment: require('./loanPayment.controller'),
    sendResponse
}