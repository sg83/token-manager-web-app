const chaiHttp = require('chai-http');
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

const config = require('../../../config')
const app = require('../../../controllers/tokenController');

const Token = require('../../../models/Tokens')
const db = require('../../../db/db.js');

const timeStamp = Date.now();
chai.use(chaiHttp);

describe('Unit test', () => {

    before((done) => {
        db.connectMongodb().then(() => done()).catch((err) => done(err));
    })

    beforeEach(function () {
        this.Token = require('../../../models/Tokens').Token ;
    });

    describe("Create a new token using generateToken works", () => {

        const tokenController = require('../../../controllers/tokenController');
        var token =  tokenController.generateToken();

        it("status of the created token should be true", ()=> {
            expect(token.status).to.be.true;
        });
    
        it("status of the created token should be empty", ()=> {
            expect(token.name).to.equal('');
        });
    
        it("description should match input", ()=> {
            expect(token.description).to.equal('');
        });

        it("check if API token exists using checkAPITokenExists", ()=> {
            expect(tokenController.checkAPITokenExists(token)).to.be.true;
        });

        it("check if API token is active using isAPITokenActive", ()=> {
            expect(tokenController.isAPITokenActive(token)).to.be.true;
        });

    });

});