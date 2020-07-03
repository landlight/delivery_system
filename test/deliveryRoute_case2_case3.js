// I would like to prepare the to prepare the data structure for case 2 and case 3 

process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let db = require('../database');

chai.use(chaiHttp);

describe('Create Data for testing case 2 and case 3', () => {
    before((done) => { //Before each test we empty the database
        setTimeout(function() {
            db.get().dropDatabase(() => {
                chai.request(server)
                    .post('/api/deliveryRoute')
                    .send({deliveryRoute: "AB1"})
                    .end((err, res) => {
                    res.should.have.status(200);
                });
                chai.request(server)
                .post('/api/deliveryRoute')
                .send({deliveryRoute: "AC4"})
                .end((err, res) => {
                    res.should.have.status(200)
                });
                chai.request(server)
                    .post('/api/deliveryRoute')
                    .send({deliveryRoute: "AD10"})
                    .end((err, res) => {
                    res.should.have.status(200);
                });
                chai.request(server)
                    .post('/api/deliveryRoute')
                    .send({deliveryRoute: "BE3"})
                    .end((err, res) => {
                    res.should.have.status(200);
                });
                chai.request(server)
                .post('/api/deliveryRoute')
                .send({deliveryRoute: "CD4"})
                .end((err, res) => {
                    res.should.have.status(200);
                });
                chai.request(server)
                    .post('/api/deliveryRoute')
                    .send({deliveryRoute: "CF2"})
                    .end((err, res) => {
                    res.should.have.status(200);
                });
                chai.request(server)
                    .post('/api/deliveryRoute')
                    .send({deliveryRoute: "DE1"})
                    .end((err, res) => {
                    res.should.have.status(200);
                });
                chai.request(server)
                    .post('/api/deliveryRoute')
                    .send({deliveryRoute: "EB3"})
                    .end((err, res) => {
                    res.should.have.status(200);
                });
                chai.request(server)
                    .post('/api/deliveryRoute')
                    .send({deliveryRoute: "EA2"})
                    .end((err, res) => {
                    res.should.have.status(200);
                });
                chai.request(server)
                    .post('/api/deliveryRoute')
                    .send({deliveryRoute: "FD1"})
                    .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
            })
        }, 5000); 
    });
    
    describe('Tests for Case 2  /api/deliveryRoute/findCostByRoute', () => { 
        it('2.1 No Query Param => expect fail', (done) => {
            chai.request(server)
                .get('/api/deliveryRoute/possibleRoute')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql('deliveryPath is required.');
                done();
            });
        })
        const deliveryPathErrorMessage = "deliveryPath must be exactly 3 words in format (A-B). (A: starting destination, B: ending destination";
        it('2.2 Delivery Path Format Check 1 => expect fail', (done) => {
            chai.request(server)
                .get('/api/deliveryRoute/possibleRoute')
                .query({deliveryPath: "A-"})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql(deliveryPathErrorMessage);
                done();
            });
        })
        it('2.3 Delivery Path Format Check 2 => expect fail', (done) => {
            chai.request(server)
                .get('/api/deliveryRoute/possibleRoute')
                .query({deliveryPath: "A-3"})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql(deliveryPathErrorMessage);
                done();
            });
        })
        it('2.4 Delivery Path Format Check 3 => expect fail', (done) => {
            chai.request(server)
                .get('/api/deliveryRoute/possibleRoute')
                .query({deliveryPath: "AB3"})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql(deliveryPathErrorMessage);
                done();
            });
        })
        it('2.5 Delivery Path Format Check 4 => expect fail', (done) => {
            chai.request(server)
                .get('/api/deliveryRoute/possibleRoute')
                .query({deliveryPath: "3-A"})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql(deliveryPathErrorMessage);
                done();
            });
        })
        it('2.6 maximumStop input error => expect fail', (done) => {
            chai.request(server)
                .get('/api/deliveryRoute/possibleRoute')
                .query({deliveryPath: "A-B", maximumStop: "A"})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql("maximumStop must be type: Integer");
                done();
            });
        })
        it('2.6 deliveryCost input error => expect fail', (done) => {
            chai.request(server)
                .get('/api/deliveryRoute/possibleRoute')
                .query({deliveryPath: "A-B", deliveryCost: "A"})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql("deliveryCost must be type: Integer");
                done();
            });
        })
        it('2.7 Test Case 2.1 => expect pass', (done) => {
            chai.request(server)
                .get('/api/deliveryRoute/possibleRoute')
                .query({deliveryPath: "E-D", maximumStop: 4})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('possiblePaths');
                    res.body.possiblePaths.should.be.eql(4);
                done();
            });
        })
        it('2.8 Test Case 2.2 => expect pass', (done) => {
            chai.request(server)
                .get('/api/deliveryRoute/possibleRoute')
                .query({deliveryPath: "E-E"})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('possiblePaths');
                    res.body.possiblePaths.should.be.eql(5);
                done();
            });
        })
        it('2.9 Self Test Case Delivery Cost => expect pass', (done) => {
            chai.request(server)
                .get('/api/deliveryRoute/possibleRoute')
                .query({deliveryPath: "E-D", maximumStop: 4, deliveryCost: 16})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('possiblePaths');
                    res.body.possiblePaths.should.be.eql(3);
                done();
            });
        })
        it('2.10 Self Test Case Delivery Cost => No Route => expect pass', (done) => {
            chai.request(server)
                .get('/api/deliveryRoute/possibleRoute')
                .query({deliveryPath: "A-G", maximumStop: 4, deliveryCost: 16})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('possiblePaths');
                    res.body.possiblePaths.should.be.eql(0);
                done();
            });
        })
    });

    describe('Tests for Case 3  /api/deliveryRoute/cheapestCost', () => { 
        it('3.1 No Query Param => expect fail', (done) => {
            chai.request(server)
                .get('/api/deliveryRoute/cheapestCost')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql('deliveryPath is required.');
                done();
            });
        })
        const deliveryPathErrorMessage = "deliveryPath must be exactly 3 words in format (A-B). (A: starting destination, B: ending destination";
        it('3.2 Delivery Path Format Check 1 => expect fail', (done) => {
            chai.request(server)
                .get('/api/deliveryRoute/cheapestCost')
                .query({deliveryPath: "A-"})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql(deliveryPathErrorMessage);
                done();
            });
        })
        it('3.3 Delivery Path Format Check 2 => expect fail', (done) => {
            chai.request(server)
                .get('/api/deliveryRoute/cheapestCost')
                .query({deliveryPath: "A-3"})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql(deliveryPathErrorMessage);
                done();
            });
        })
        it('3.4 Delivery Path Format Check 3 => expect fail', (done) => {
            chai.request(server)
                .get('/api/deliveryRoute/cheapestCost')
                .query({deliveryPath: "AB3"})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql(deliveryPathErrorMessage);
                done();
            });
        })
        it('3.5 Delivery Path Format Check 4 => expect fail', (done) => {
            chai.request(server)
                .get('/api/deliveryRoute/cheapestCost')
                .query({deliveryPath: "3-A"})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql(deliveryPathErrorMessage);
                done();
            });
        })
        it('3.6 Test Case 3.1 => expect pass', (done) => {
            chai.request(server)
                .get('/api/deliveryRoute/cheapestCost')
                .query({deliveryPath: "E-D"})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('cheapestCost');
                    res.body.cheapestCost.should.be.eql(9);
                done();
            });
        })
        it('3.7 Test Case 3.2 => expect pass', (done) => {
            chai.request(server)
                .get('/api/deliveryRoute/cheapestCost')
                .query({deliveryPath: "E-E"})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('cheapestCost');
                    res.body.cheapestCost.should.be.eql(6);
                done();
            });
        })
        it('3.8 Self Test Case => No Possible Path', (done) => {
            chai.request(server)
                .get('/api/deliveryRoute/cheapestCost')
                .query({deliveryPath: "A-G"})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql("No Possible Path");
                done();
            });
        })
    });
});
    