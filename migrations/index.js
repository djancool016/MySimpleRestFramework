const Migration = require('./base.migrations')

/**
 * The object migrations contains keys for table names and values containing migration objects.
 */
const migrations = {
    status: require('./202405250102-create-status'),
    loan: require('./202405250109-create-loan'),
    loanPayment: require('./202405250205-create-loanPayment')
}

module.exports = {
    /**
     * 
     * @param {Object} db Database connection 
     * @returns 
     */
    migration: (db) => Migration.migrate({migrations, db})
}