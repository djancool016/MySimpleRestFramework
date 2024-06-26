require('dotenv').config()
const util = require('util')

const bcrypt = require('bcrypt')
const genSalt = util.promisify(bcrypt.genSalt)
const hash = util.promisify(bcrypt.hash)
const compare = util.promisify(bcrypt.compare)

/**
 * PasswordManager class for hashing password and compare password with hashed password
 */
class PasswordManager {

    /**
     * @param {String} password user input password
     * @param {Number} saltRounds rounds for hashing password, default = 10
     * @returns hashed password
     */
    static async encrypt(password, saltRounds = 10){

        try {
            const salt = await genSalt(saltRounds)
            const hashedPassword = await hash(`${password}`, salt)
            return hashedPassword

        } catch (error) {
            throw new Error('Error hashing password: ' + error)
        }
    }
    /**
     * @param {String} password user input password
     * @param {String} hashedPassword hashed password from database
     * @returns Boolean
     */
    static async compare(password, hashedPassword){

        try {
            const result = await compare(`${password}`, hashedPassword)
            return result

        } catch (error) {
            throw new Error('Error comparing password: ' + error)
        }
    }
}

module.exports = PasswordManager