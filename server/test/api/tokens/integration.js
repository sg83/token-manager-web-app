const chaiHttp = require('chai-http');
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

const request = require('supertest');
const config = require('../../../config')
const app = require('../../../server.js');
const db = require('../../../db/db.js');
const timeStamp = Date.now();

describe('Integration test', () => {

    before((done) => {
        db.connectMongodb().then(() => done()).catch((err) => done(err));
    })
    
    describe('Test token generation and list',() => {

        it('Creating a new admin user using POST /api/user/register works.', function(done) {
            chai.request(app)
                .post('/api/user/register')
                .send({ 
                    name: config.UNITTEST_USER_NAME,
                    email: config.UNITTEST_USER_EMAIL,
                    password: config.UNITTEST_USER_PASSWORD
                })
                .end(function(err, res){
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('name');
                    res.body.name.should.equal(config.UNITTEST_USER_NAME);
                    res.body.should.have.property('email');
                    res.body.email.should.equal(config.UNITTEST_USER_EMAIL);
                    done();
              });
        });

        it('Login using the admin user using POST /api/user/login works.', (done) => {

            var user = request(app).post('/api/user/login')
                .send({ 
                    email: config.UNITTEST_USER_EMAIL,
                    password: config.UNITTEST_USER_PASSWORD
                })
                .then((res) => {
                    res.body.should.have.property('idToken');
                    res.body.should.have.property('expiresIn');
                    res.body.expiresIn.should.not.equal("");
                    res.body.expiresIn.should.equal(config.JWT_TOKEN_EXPIRY);
                    done();
                })
                .catch((err) => done(err));

        });

        const tokenName = config.UNITTEST_TOKEN_NAME + "_" + timeStamp;
        const tokenDescription = config.UNITTEST_TOKEN_DESCRIPTION + "_" + timeStamp;
        var token = null;
        it('Creating a new token using POST /api/token/generate works.', (done) => {
            request(app)
                .post('/api/token/generate')
                .set('Authorization', 'Bearer ' + config.UNITTEST_JWTTOKEN )
                .send({
                    name: tokenName,
                    description: tokenDescription
                })
                .then((res) => {
                    const body = res.body;
                    res.body.should.have.property('_id');
                    res.body.should.have.property('name').to.be.equal(tokenName);
                    res.body.should.have.property('description').to.be.equal(tokenDescription);
                    res.body.should.have.property('validTo');
                    res.body.should.have.property('createdAt');
                    res.body.should.have.property('status');
                    token = body._id;
                    done();
                })
                .catch((err) => done(err));
        });

        it('Creating a new token using POST /api/token/generate does not work without JWT Token. Expected to return 403 status code (Forbidden)', function(done) {
            request(app)
                .get('/api/token/generate' + token)
                .send()
                .end(function(err, res){
                    res.should.have.status(403);
                    done();
              });
        });

        it('Fetching token details using GET /api/token/:tokenId works.', (done) => {
            request(app)
                .get('/api/token/' + token)
                .set('Authorization', 'Bearer ' + config.UNITTEST_JWTTOKEN )
                .send()
                .then((res) => {
                    const body = res.body;
                    res.body.should.have.property('_id').to.be.equal(token);;
                    res.body.should.have.property('name').to.be.equal(tokenName);
                    res.body.should.have.property('validTo');
                    res.body.should.have.property('createdAt');
                    res.body.should.have.property('status').to.be.equal(true);
                    token = body._id;
                    done();
                })
                .catch((err) => done(err));
        });

        it('Fetching token details using GET /api/token/:tokenId does not work without JWT Token. Expected to return 403 status code (Forbidden)', function(done) {
            request(app)
                .get('/api/token/' + token)
                .send()
                .end(function(err, res){
                    res.should.have.status(403);
                    done();
              });
        });

        it('Validating token using GET /api/token/validate/:tokenId return 200 (Validation Passed).', (done) => {
            request(app)
                .get('/api/token/validate/' + token)
                .set('Authorization', 'Bearer ' + config.UNITTEST_JWTTOKEN )
                .send()
                .then((res) => {
                    res.should.have.status(200);
                    done();
                })
                .catch((err) => done(err));
        });

        it('Validating token using GET /api/token/validate/:tokenId works without having to specific JWT token..', (done) => {
            request(app)
                .get('/api/token/validate/' + token)
                .send()
                .then((res) => {
                    res.should.have.status(200);
                    done();
                })
                .catch((err) => done(err));
        });

        it('Update token status using PATCH /api/token/:tokenId works.', (done) => {
            request(app)
                .patch('/api/token/' + token)
                .set('Authorization', 'Bearer ' + config.UNITTEST_JWTTOKEN )
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    'status' : false,
                    'name' : 'Updated name'
                  })
                .then((res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('_id').to.be.equal(token);;
                    res.body.should.have.property('name').to.be.equal('Updated name');
                    res.body.should.have.property('validTo');
                    res.body.should.have.property('createdAt');
                    res.body.should.have.property('status').to.be.equal(false);
                    done();
                })
                .catch((err) => done(err));
        });

        it('Updating token status using PATCH /api/token/:tokenId does not work without JWT Token. Expected to return 403 status code (Forbidden)', (done) => {
            request(app)
                .patch('/api/token/' + token)
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    'status' : false,
                    'name' : 'Updated name'
                  })
                .then((res) => {
                    res.should.have.status(403);
                    done();
                })
                .catch((err) => done(err));
        });

        it('Validating token using GET /api/token/validate/:tokenId returns 404 (Validation Failed - Inactive token).', (done) => {
            request(app)
                .get('/api/token/validate/' + token)
                .set('content-type', 'application/x-www-form-urlencoded')
                .send()
                .then((res) => {
                    res.should.have.status(404);
                    done();
                })
                .catch((err) => done(err));
        });

        it('Getting the token list using GET /api/token works', (done) => {
            request(app)
                .get('/api/token/')
                .set('Authorization', 'Bearer ' + config.UNITTEST_JWTTOKEN )
                .send()
                .then((res) => {
                    const body = res.body[0];
                    body.should.have.property('_id');
                    body.should.have.property('name');
                    body.should.have.property('validTo');
                    body.should.have.property('createdAt');
                    body.should.have.property('status');
                    res.should.have.status(200);
                    done();
                })
                .catch((err) => done(err));
        });

        it('Getting the token list using GET /api/token does not work without JWT Token. Expected to return 403 status code (Forbidden)', (done) => {
            request(app)
                .get('/api/token/')
                .send()
                .then((res) => {
                    res.should.have.status(403);
                    done();
                })
                .catch((err) => done(err));
        });

        it('Deleting the token using DELETE /api/token/:tokenId does not work without JWT Token. Expected to return 403 status code (Forbidden)', (done) => {
            request(app)
                .delete('/api/token/' + token)
                .send()
                .then((res) => {
                    res.should.have.status(403);
                    done();
                })
                .catch((err) => done(err));
        });

        it('Deleting the token using DELETE /api/token/:tokenId works', (done) => {
            request(app)
                .delete('/api/token/' + token)
                .set('Authorization', 'Bearer ' + config.UNITTEST_JWTTOKEN )
                .send()
                .then((res) => {
                    res.should.have.status(200);
                    done();
                })
                .catch((err) => done(err));
        });

        it('Fetching token details using GET /api/token/:tokenId works.', (done) => {
            request(app)
                .get('/api/token/' + token)
                .set('Authorization', 'Bearer ' + config.UNITTEST_JWTTOKEN )
                .send()
                .then((res) => {
                    const body = res.body;
                    res.should.have.status(400);
                    done();
                })
                .catch((err) => done(err));
        });

        it('Deleting an admin user works', (done) => {
            request(app)
                .delete('/api/user/' + config.UNITTEST_USER_EMAIL)
                .set('Authorization', 'Bearer ' + config.UNITTEST_JWTTOKEN )
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
    });
})