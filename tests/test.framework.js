const {db, pool} = require('../database').init()

/**
 * Data-Driven Testing (DDT) for module classes
 */
class TestFramework {
    /**
     * 
     * @param {Object} testObj test cases
     * @param {Object} module instance of the module class
     */
    constructor(testObj = {}, module) {
        this.testObj = testObj
        this.module = module
    }

    testMethod(method, testCases) {
        describe(`Test ${method} method`, () => {
            testCases.forEach(testCase => {
                test(testCase.description, async () => {
                    try {
                        const result = await this.module[method](testCase.input)

                        for (const [outputKey, outputVal] of Object.entries(testCase.output)) {
                            switch (outputKey) {
                                case 'status':
                                    expect(result.status).toEqual(outputVal)
                                    break
                                case 'data':
                                    if (Array.isArray(result.data)) {
                                        expect(result.data).toEqual(expect.arrayContaining(
                                            outputVal.map(out => expect.objectContaining(out))
                                        ))
                                    } else {
                                        expect(result.data).toEqual(expect.objectContaining(outputVal))
                                    }
                                    break
                                case 'code':
                                    expect(result.code).toEqual(outputVal)
                                    break
                                default:
                                    throw new Error(`Unknown output key: ${outputKey}`)
                            }
                        }
                    } catch (error) {
                        console.error(`Error in test case "${testCase.description}":`, error)
                        throw error
                    }
                })
            })
        })
    }

    async beforeAll() {
        await db.connect()
    }

    async afterAll() {
        await pool.end()
        await db.end() 
    }

    async testBuilder() {
        for (const [method, testCases] of Object.entries(this.testObj)) {
            this.testMethod(method, testCases)
        }
    }

    async runTest() {
        describe(`Test class ${this.module.constructor.name}`, () => {
            beforeAll(async () => this.beforeAll())

            this.testBuilder()

            afterAll(async () => this.afterAll())
        })
    }
}

module.exports = TestFramework