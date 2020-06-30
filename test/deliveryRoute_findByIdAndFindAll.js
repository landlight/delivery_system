process.env.NODE_ENV = 'test';
// Create Delivery Route

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let db = require('../database');

chai.use(chaiHttp);
describe('findAll delivery route tests', () => {
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
