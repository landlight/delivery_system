process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let db = require('../database');

chai.use(chaiHttp);

// Input tests
describe('GET /api/deliveryRoute/findCostByRoute', () => {
    beforeEach((done) => { 
        setTimeout(function() {
            done()
        }, 200); 
    });
    it('1. NoDeliveryPath => expect fail', (done) => {
        chai.request(server)
            .get('/api/deliveryRoute/findCostByRoute')
            .query({deliveryPath: ''})
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

// Message No Path Route and Correct Test
describe('3. No Path Route and Correct Test', () => {
    before((done) => { //Before each test we empty the database
        setTimeout(function() {
            db.get().dropDatabase(() => {
                done();
            })
        }, 200); 
    });
    describe('Create Data for testing  /api/deliveryRoute/findCostByRoute', () => {
        it('3.1. Create Data Paths for testing Case 1', (done) => {
            chai.request(server)
                .post('/api/deliveryRoute')
                .send({deliveryRoute: "AB3"})
                .end((err, res) => {
                    res.should.have.status(200);
                done();
            });
        });
        it('3.2. Create Data Paths for testing Case 1', (done) => {
            chai.request(server)
                .post('/api/deliveryRoute')
                .send({deliveryRoute: "BC4"})
                .end((err, res) => {
                    res.should.have.status(200);
                done();
            });
        });
        it('3.3. Create Data Paths for testing Case 1', (done) => {
            chai.request(server)
                .post('/api/deliveryRoute')
                .send({deliveryRoute: "CE10"})
                .end((err, res) => {
                    res.should.have.status(200);
                done();
            });
        });
        it('3.4. Create Data Paths for testing Case 1', (done) => {
            chai.request(server)
                .post('/api/deliveryRoute')
                .send({deliveryRoute: "EF2"})
                .end((err, res) => {
                    res.should.have.status(200);
                done();
            });
        });
        it('3.5. No Path Route', (done) => {
            chai.request(server)
                .get('/api/deliveryRoute/findCostByRoute')
                .query({deliveryPath: 'A-B-D-E'})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql("No Such Route");
                done();
            });
        });
        it('3.6. No Path Route', (done) => {
            chai.request(server)
                .get('/api/deliveryRoute/findCostByRoute')
                .query({deliveryPath: 'A-B-E-F'})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql("No Such Route");
            done();
            });
        });
        it('3.7. Correct Path => expect 7', (done) => {
            chai.request(server)
                .get('/api/deliveryRoute/findCostByRoute')
                .query({deliveryPath: 'A-B-C'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('deliveryCost');
                    res.body.deliveryCost.should.be.eql(7); // 3 + 4
            done();
            });
        });
        it('3.8. Correct Path => expect 16', (done) => {
            chai.request(server)
                .get('/api/deliveryRoute/findCostByRoute')
                .query({deliveryPath: 'B-C-E-F'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('deliveryCost');
                    res.body.deliveryCost.should.be.eql(16); // 4 + 10 + 2
            done();
            });
        });
    });
});  



    