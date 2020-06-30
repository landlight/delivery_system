process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

// test health
describe('/health api', () => {
    it('it should return success', (done) => {
    chai.request(server)
        .get('/api/health')
        .end((err, res) => {
            res.should.have.status(200)
            res.body.message.should.be.eql("success");
        done();
        });
    });
});