
// NOTE: Will only allow updating delivery cost 
process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

describe('PUT /api/deliveryRoute/{id}', () => {
    it('1. UpdateById => Not ObjectId => expect fail', (done) => {
        chai.request(server)
            .put('/api/deliveryRoute/1234567')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.message.should.be.eql('id must be an ObjectID.');
            done();
        });
    });
    it('2. UpdateById => No Delivery Cost => expect fail', (done) => {
        chai.request(server)
            .put('/api/deliveryRoute/5efb99c5f5fd48292c56887c')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.message.should.be.eql('deliveryCost is required.');
            done();
        });
    });
    it('3. UpdateById => Delivery Cost must be integer => expect fail', (done) => {
        chai.request(server)
            .put('/api/deliveryRoute/5efb99c5f5fd48292c56887c')
            .send({deliveryCost: "A"})
            .end((err, res) => {
                res.should.have.status(400);
                res.body.message.should.be.eql('deliveryCost must be type: Integer');
            done();
        });
    });
    it('4. UpdateById => Data not exists => expect fail', (done) => {
        chai.request(server)
            .put('/api/deliveryRoute/5efc5fe153985f5b049aa114')
            .send({deliveryCost: 5})
            .end((err, res) => {
                res.should.have.status(400);
                res.body.message.should.be.eql('delivery route not found.');
            done();
        });
    });
    it.skip('5. UpdateById => correct => expect pass', (done) => {
        chai.request(server)
            .put('/api/deliveryRoute/5efc5fe153985f5b049aa6b3')
            .send({deliveryCost: 5})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('fromPath');
                res.body.should.have.property('toPath');
                res.body.should.have.property('deliveryCost');
                res.body.should.have.property('id');
                res.body.should.have.property('createdAt');
                res.body.should.have.property('updatedAt');
                res.body.deliveryCost.should.be.eql(5);
            done();
        });
    });
});

describe('DELETE /api/deliveryRoute/{id}', () => {
    it('1. DeleteById => Not ObjectId => expect fail', (done) => {
        chai.request(server)
            .delete('/api/deliveryRoute/1234567')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.message.should.be.eql('id must be an ObjectID.');
            done();
        });
    });
    it('2. DeleteById => Data not exists => expect fail', (done) => {
        chai.request(server)
            .delete('/api/deliveryRoute/5efc5fe153985f5b049aa114')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.message.should.be.eql('delivery route not found.');
            done();
        });
    });
});

describe('Delete /api/deliveryRoute/{id}', () => {
    it('3. deleteById correct input => expect success', (done) => {
        chai.request(server)
            .post('/api/deliveryRoute')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('toPath');
                res.body.should.have.property('fromPath');
                res.body.should.have.property('deliveryCost');
                res.body.should.have.property('createdAt');
                res.body.should.have.property('updatedAt');
                let idToDelete = res.body.id;
                (done) => {
                    chai.request(server)
                    .post(`/api/deliveryRoute/${idToDelete}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.message.should.be.eql("success");
                        done();
                    });
                };
        });
    });
}); 