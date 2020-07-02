process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

// Input tests
describe('GET /api/deliveryRoute/findCostByRoute', () => {
    it('1. NoDeliveryPath => expect fail', (done) => {
        chai.request(server)
            .get('/api/deliveryRoute/findCostByRoute')
            .query({})
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('message');
                res.body.message.should.be.eql('deliveryPath is required.');
            done();
        });
    });
    let errorMessage = "deliveryPath must be in formats such as A-B, A-B-C, A-B-C-D and the values must be characters";
    it('2.1 DeliveryPath wrong formats => expect fail', (done) => {
        chai.request(server)
            .get('/api/deliveryRoute/findCostByRoute')
            .query({deliveryPath: 'A-'})
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('message');
                res.body.message.should.be.eql(errorMessage);
            done();
        });
    });
    it('2.2 DeliveryPath wrong formats => expect fail', (done) => {
        chai.request(server)
            .get('/api/deliveryRoute/findCostByRoute')
            .query({deliveryPath: 'A-3'})
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('message');
                res.body.message.should.be.eql(errorMessage);
            done();
        });
    });
    it('2.3 DeliveryPath wrong formats => expect fail', (done) => {
        chai.request(server)
            .get('/api/deliveryRoute/findCostByRoute')
            .query({deliveryPath: 'A-B3'})
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('message');
                res.body.message.should.be.eql(errorMessage);
            done();
        });
    });
    it('2.4 DeliveryPath wrong formats => expect fail', (done) => {
        chai.request(server)
            .get('/api/deliveryRoute/findCostByRoute')
            .query({deliveryPath: '3-4-3'})
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('message');
                res.body.message.should.be.eql(errorMessage);
            done();
        });
    });
    it('2.5 DeliveryPath wrong formats => expect fail', (done) => {
        chai.request(server)
            .get('/api/deliveryRoute/findCostByRoute')
            .query({deliveryPath: 'ABCDE'})
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('message');
                res.body.message.should.be.eql(errorMessage);
            done();
        });
    });
    it('2.6 DeliveryPath wrong formats => expect fail', (done) => {
        chai.request(server)
            .get('/api/deliveryRoute/findCostByRoute')
            .query({deliveryPath: 'A'})
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('message');
                res.body.message.should.be.eql(errorMessage);
            done();
        });
    });
});