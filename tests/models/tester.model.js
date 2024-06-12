const {db, pool, truncateAll} = require('../../database').init()
const {seedTables} = require('../../seeders')
const {migration} = require('../../migrations')
const TestFramework = require('../test.framework')

class ModelTester extends TestFramework {
    constructor(testObj = {}, module) {
        super(testObj, module)
    }
    async beforeAll(){
        await db.connect().then(async db => {
            await truncateAll(db)
            await migration(db)
            await seedTables(db)
        })
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
}

module.exports = ModelTester