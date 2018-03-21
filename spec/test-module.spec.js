var req = require('request')
describe('Get messages', () => {
    it('Should be 200 OK', (done) => {
        req.get('http://localhost:3000/messages', (err, res) => {
            expect(res.statusCode).toBe(200)
            done()
        })
    })

    it('Should be 0 or more messages', (done) => {
        req.get('http://localhost:3000/messages', (err, res) => {
            expect(JSON.parse(res.body).length).toBeGreaterThanOrEqual(0)
            done()
        })
    })
})

describe('Get message from Fazor',()=>{
    it('Should be 200 OK', (done)=>{
        req.get('http://localhost:3000/messages/Fazor', (err, res) => {
            expect(res.statusCode).toBe(200)
            done()
        })
    })

    
    it('Should be 0 or more messages from Fazor', (done) => {
        req.get('http://localhost:3000/messages/Fazor', (err, res) => {
            expect(JSON.parse(res.body)[0].name).toEqual('Fazor')
            done()
        })
    })
})