const Seeder = require('./base.seeder')

const seeds = {
    statusSeed: require('./202405270955-status-seed'),
    loanSeed: require('./202405271321-loan-seed'),
    loanPayment: require('./202405271350-loanPayment-seed')
}

async function seedTables(db) {
    const arraySeeds = Object.values(seeds)
    await Seeder.seedTables(arraySeeds, db)
}

module.exports = {
    seedTables: (db) => seedTables(db)
}