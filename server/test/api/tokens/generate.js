const expect = require('chai').expect;
const request = require('supertest');

const config = require('./../../../config')
const app = require('../../../server.js');
const db = require('../../../db/db.js');


describe('End to end test', () => {

    before((done) => {
        db.connectMockgoose().then(() => done()).catch((err) => done(err));
    })

    after((done) => {
        db.close().then(() => done()).catch((err) => done(err));
    })

    it('Creating a new admin user works', (done) => {
        request(app).post('/api/user/register')
            .send({ 
                name: config.NAME,
                email: config.EMAIL,
                password: config.PASSWORD
            })
            .then((res) => {
                const body = res.body;
                done();
            })
            .catch((err) => done(err));
    });

    it('Login using the admin user', (done) => {
        request(app).post('/api/user/login')
            .send({ 
                email: config.EMAIL,
                password: config.PASSWORD
            })
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property('idToken');
                expect(body).to.contain.property('expiresIn');
                done();
            })
            .catch((err) => done(err));
    });

    it('Creating a new token works', (done) => {
        request(app).post('/api/token/generate')
            .set('Authorization', 'Bearer ' + config.JWTTOKEN )
            .send({
                name: 'Token_test',
                description: "generate token Token_test for unit testing"
            })
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property('_id');
                expect(body).to.contain.property('name');
                expect(body).to.contain.property('description');
                expect(body).to.contain.property('validTo');
                expect(body).to.contain.property('createdAt');
                expect(body).to.contain.property('status');
                done();
            })
            .catch((err) => done(err));
    });

    it('Get token list works', (done) => {
        request(app).get('/api/token/')
            .set('Authorization', 'Bearer ' + config.JWTTOKEN )
            .send()
            .then((res) => {
                const body = res.body[0];
                expect(body).to.contain.property('_id');
                expect(body).to.contain.property('name');
                expect(body).to.contain.property('description');
                expect(body).to.contain.property('validTo');
                expect(body).to.contain.property('createdAt');
                expect(body).to.contain.property('status');
                done();
            })
            .catch((err) => done(err));
    });

    const deleteURL = '/api/user/' + config.EMAIL;
    console.log('deleteURL ' + deleteURL);
    it('Deleting an admin user works', (done) => {
        request(app).delete(deleteURL)
            .set('Authorization', 'Bearer ' + config.JWTTOKEN )
            .send({
            })
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property('n');
                expect(body).to.contain.property('ok');
                expect(body).to.contain.property('deletedCount');
                done();
            })
            .catch((err) => done(err));
    });

})