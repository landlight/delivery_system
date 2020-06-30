process.env.NODE_ENV = 'test';
// Create Delivery Route

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let db = require('../database');

chai.use(chaiHttp);
describe('insert delivery route tests', () => {
    beforeEach((done) => { //Before each test we empty the database
        setTimeout(function() {
            db.get().dropDatabase(() => {
                done();
            })
        }, 200); 
    });
    let createErrorMessage = "deliveryRoute must be at least 3 characters " +
                             "and of format AB3 (first and second (locations) " +
                             "are characters follow by number (distance cost)).";
    describe('/api/deliveryRoute/', () => {
        it('1. No deliveryRoute input body => expect fail', (done) => {
            chai.request(server)
                .post('/api/deliveryRoute')
                .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.have.property('message');
                        res.body.message.should.be.eql('deliveryRoute is required.');
                done();
            });
        });
    });
    describe('/api/deliveryRoute/', () => {
        it('2. deliveryRoute input body fromLocation is Integer => expect fail', (done) => {
            chai.request(server)
                .post('/api/deliveryRoute')
                .send({deliveryRoute: '0B3'})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql(createErrorMessage);
                done();
            });
        });
    });
    describe('/api/deliveryRoute/', () => {
        it('3. deliveryRoute input body toLocation is Integer => expect fail', (done) => {
            chai.request(server)
                .post('/api/deliveryRoute')
                .send({deliveryRoute: 'A03'})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql(createErrorMessage);
                done();
            });
        });
    });
    describe('/api/deliveryRoute/', () => {
        it('4. deliveryRoute input body distance cost is Not Integer => expect fail', (done) => {
            chai.request(server)
                .post('/api/deliveryRoute')
                .send({deliveryRoute: 'ABC'})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql(createErrorMessage);
                done();
            });
        });
    });
    describe('/api/deliveryRoute/', () => {
        it('5. deliveryRoute correct input => expect success', (done) => {
            chai.request(server)
                .post('/api/deliveryRoute')
                .send({deliveryRoute: "AB3"})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('toPath');
                    res.body.should.have.property('fromPath');
                    res.body.should.have.property('deliveryCost');
                    res.body.should.have.property('createdAt');
                    res.body.should.have.property('updatedAt');
                done();
            });
        });
    });  
})

describe('/api/deliveryRoute/', () => {
    it('6. deliveryRoute correct input => same item => already exists route expect fail', (done) => {
        chai.request(server)
            .post('/api/deliveryRoute')
            .send({deliveryRoute: "AB3"})
            .end((err, res) => {
                res.should.have.status(400);
                res.body.message.should.be.eql('DeliveryRoute already exists.');
            done();
        });
    });
}); 

describe('/api/deliveryRoute/', () => {
    it('6. deliveryRoute correct input => different cost => already exists route expect fail', (done) => {
        chai.request(server)
            .post('/api/deliveryRoute')
            .send({deliveryRoute: "AB5"})
            .end((err, res) => {
                res.should.have.status(400);
                res.body.message.should.be.eql('DeliveryRoute already exists.');
            done();
        });
    });
}); 

describe('/api/deliveryRoute/', () => {
    it('6. deliveryRoute correct input => already exists route expect fail', (done) => {
        chai.request(server)
            .post('/api/deliveryRoute')
            .send({deliveryRoute: "BC3"})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('toPath');
                res.body.should.have.property('fromPath');
                res.body.should.have.property('deliveryCost');
                res.body.should.have.property('createdAt');
                res.body.should.have.property('updatedAt');
            done();
        });
    });
}); 