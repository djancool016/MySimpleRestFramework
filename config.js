require('dotenv').config()

module.exports = {
    // database configuration
    db_config: {
        host: 'localhost',
        user: 'root',
        password: process.env.LOCAL_DB_PASSWORD,
        database: 'bkm_db_test'
    },
    logging: false,
    
    // start databse database migration
    migrating: true,

    // start database seeding
    seeding: true,
    
    // start delete all data in tables permanently
    resetTables: true
}