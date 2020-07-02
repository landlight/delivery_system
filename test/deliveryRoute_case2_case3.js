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
                done();
            })
        }, 200); 
        it('1.1 Create Data Paths for testing Case 2 and 3', (done) => {
            chai.request(server)
                .post('/api/deliveryRoute')
                .send({deliveryRoute: "AB1"})
                .end((err, res) => {
                    res.should.have.status(200);
                done();
            });
        });
        it('1.2. Create Data Paths for testing Case 2 and 3', (done) => {
            chai.request(server)
                .post('/api/deliveryRoute')
                .send({deliveryRoute: "AC4"})
                .end((err, res) => {
                    res.should.have.status(200);
                done();
            });
        });
        it('1.3. Create Data Paths for testing Case 2 and 3', (done) => {
            chai.request(server)
                .post('/api/deliveryRoute')
                .send({deliveryRoute: "AD10"})
                .end((err, res) => {
                    res.should.have.status(200);
                done();
            });
        });
        it('1.4. Create Data Paths for testing Case 2 and 3', (done) => {
            chai.request(server)
                .post('/api/deliveryRoute')
                .send({deliveryRoute: "BE3"})
                .end((err, res) => {
                    res.should.have.status(200);
                done();
            });
        });
        it('1.5. Create Data Paths for testing Case 2 and 3', (done) => {
            chai.request(server)
                .post('/api/deliveryRoute')
                .send({deliveryRoute: "CD4"})
                .end((err, res) => {
                    res.should.have.status(200);
                done();
            });
        });
        it('1.6. Create Data Paths for testing Case 2 and 3', (done) => {
            chai.request(server)
                .post('/api/deliveryRoute')
                .send({deliveryRoute: "DE1"})
                .end((err, res) => {
                    res.should.have.status(200);
                done();
            });
        });
        it('1.7. Create Data Paths for testing Case 2 and 3', (done) => {
            chai.request(server)
                .post('/api/deliveryRoute')
                .send({deliveryRoute: "EB3"})
                .end((err, res) => {
                    res.should.have.status(200);
                done();
            });
        });
        it('1.8. Create Data Paths for testing Case 2 and 3', (done) => {
            chai.request(server)
                .post('/api/deliveryRoute')
                .send({deliveryRoute: "EA2"})
                .end((err, res) => {
                    res.should.have.status(200);
                done();
            });
        });
        it('1.9. Create Data Paths for testing Case 2 and 3', (done) => {
            chai.request(server)
                .post('/api/deliveryRoute')
                .send({deliveryRoute: "FD1"})
                .end((err, res) => {
                    res.should.have.status(200);
                done();
            });
        });
    });
     // PossibleRoute Input Error Checking 
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
});
