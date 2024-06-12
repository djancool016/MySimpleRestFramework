const TestFramework = require('../test.framework');

class ServiceTester extends TestFramework {
    constructor(testObj = {}, module) {
        super(testObj, module)
    }
    async testMethod(method, testCases) {
        describe(`Test ${method} method`, () => {
            testCases.forEach(testCase => {
                test(testCase.description, async () => {
                    // start test module
                    this.header = testCase.header
                    this.req = testCase.req
                    this.res = testCase.res || { cookie: () => {} }
                    this.next = () => {}

                    await this.module[method](this.req, this.res, this.next, this.header)
                    
                    for (const [outputKey, outputVal] of Object.entries(testCase.output)) {
                        switch (outputKey) {
                            case 'status':
                                expect(this.req.result.status).toEqual(outputVal)
                                break
                            case 'data':
                                if (Array.isArray(this.req.result.data)) {
                                    expect(this.req.result.data).toEqual(expect.arrayContaining(
                                        outputVal.map(out => expect.objectContaining(out))
                                    ))
                                } else {
                                    expect(this.req.result.data).toEqual(expect.objectContaining(outputVal))
                                }
                                break
                            case 'code':
                                expect(this.req.result.code).toEqual(outputVal)
                                break
                        }
                    }
                })
            })
        })
    }
}
module.exports = ServiceTester