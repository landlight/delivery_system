process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let db = require('../database');

chai.use(chaiHttp);
describe('GET findAll delivery route tests', () => {
    describe('/api/deliveryRoute/', () => {
        it('1. findAll => no params => expect success', (done) => {
            chai.request(server)
                .get('/api/deliveryRoute/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('pageInformation')
                    res.body.should.have.property('entities')
                        
                    res.body.pageInformation.should.be.a('object');
                    res.body.pageInformation.should.have.property('size');
                    res.body.pageInformation.should.have.property('numberOfItems');
                    res.body.pageInformation.size.should.be.eql(20); 
                    
                    res.body.entities.should.be.a('array');
                    res.body.entities[0].should.have.property('fromPath');
                    res.body.entities[0].should.have.property('toPath');
                    res.body.entities[0].should.have.property('deliveryCost');
                done();
            });
        });
    });
})

describe('GET /api/deliveryRoute/', () => {
    it('1. findById => Not ObjectId => expect fail', (done) => {
        chai.request(server)
            .get('/api/deliveryRoute/1234567')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.message.should.be.eql('id must be an ObjectID.');
            done();
        });
    });
    it('2. findById => Not Existing Item => expect fail', (done) => {
        chai.request(server)
            .get('/api/deliveryRoute/5efb99c5f5fd48292c56887c')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.message.should.be.eql('delivery route not found.');
            done();
        });
    });
    it.skip('3. findById => correct => expect pass', (done) => {
        chai.request(server)
            .get('/api/deliveryRoute/5efc5fe153985f5b049aa6b3')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('fromPath');
                res.body.should.have.property('toPath');
                res.body.should.have.property('deliveryCost');
                res.body.should.have.property('id');
                res.body.should.have.property('createdAt');
                res.body.should.have.property('updatedAt');
                res.body.id.should.be.eql('5efc5fe153985f5b049aa6b3');
            done();
        });
    });
});
