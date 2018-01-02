const expect = require('chai').expect
const lambda = require('../release/index')
const event = require('../event.json')

describe('Lambda invokation', () => {

    describe('handles correct event content by', () => {
        it('returning the correct "Hello Mika!"', done => {
            lambda.handler(event, {}, (error, result) => {
                expect(error).to.equal(null)

                expect(result).to.be.a('object')
                expect(result.statusCode).to.equal(200)
                expect(result.body).to.equal('Hello Mika!')

                done()
            })
        })
    })

    describe('handles incorrect event content by', () => {
        it('returning a correct status code', done => {
            lambda.handler({}, {}, (error, result) => {
                expect(error).to.equal(null)
          
                expect(result).to.be.a('object')
                expect(result.statusCode).to.equal(200)
                expect(result.body).to.equal('Hello World!')

                done()
            })
        })
    })
})