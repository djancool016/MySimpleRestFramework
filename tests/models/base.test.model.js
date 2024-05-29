const {db, pool, truncateAll} = require('../../database').init()
const {seedTables} = require('../../seeders')
const {migration} = require('../../migrations')

/**
 * Data-Driven Testing (DDT) for model classes
 */
class BaseTestModel {
    /**
     * 
     * @param {Object} testObj test cases
     * @param {Object} model instance of the model class
     */
    constructor(testObj = {}, model){
        this.testObj = testObj
        this.model = model
    }
    async testBuilder(){
        Object.entries(this.testObj).forEach(async([method, testCases]) => {
            describe(`Test ${method} method`, () => {
                testCases.forEach(async testCase => {
                    test(testCase.description, async() => {
                        const result = await this.model[method](testCase.input)
                        
                        for(const [outputKey, outputVal] of Object.entries(testCase.output)){
                            switch(outputKey){
                                case 'status':
                                    expect(result.status).toEqual(outputVal)
                                    break
                                case 'data':
                                    if(Array.isArray(result.data)){
                                        expect(result.data).toEqual(expect.arrayContaining(
                                            outputVal.map(out => expect.objectContaining(out))
                                        ))
                                    }else{
                                        expect(result.data).toEqual(expect.objectContaining(outputVal))
                                    }
                                    break
                                case 'code':
                                    expect(result.code).toEqual(outputVal)
                                    break
                            }
                        }
                    })
                })
            })
        })
    }

    async runTest(){
        describe(`Test class ${this.model.constructor.name}`, () => {
            beforeAll(async () => {
                await db.connect().then(async db => {
                    await truncateAll(db)
                    await migration(db)
                    await seedTables(db)
                })
            })

            this.testBuilder()

            afterAll(async () => {
                await pool.end()
                await db.end()
            })
        })
    }
}

module.exports = BaseTestModel