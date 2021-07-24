const mongoose = require('mongoose');
const config = require('./../config');
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);



/**
 * Connect to mongodb
 * @return {Object} promise - return promise when connected, else error
 */
function connectMongodb() {
    return new Promise((resolve, reject) => {
        mongoose.connect(
            config.MONGO_URI,
            { useNewUrlParser: true, 
                useCreateIndex: true,
                useUnifiedTopology: true
            }).then((response, error) => {
                if (error) return reject(error);
                resolve();
            })
    });
}



/**
 * Connect to mock db during unit test
 * @return {Object} promise - return promise when connected, else error
 */
function connectMockgoose() {

    return new Promise((resolve, reject) => {
        mockgoose.prepareStorage().then(function() {
            mongoose.connect(config.MONGO_URI, { 
                useNewUrlParser: true, 
                useCreateIndex: true,
                useUnifiedTopology: true
            }).then((error, result) => {
              if (error) return reject(error);
              resolve();
            });
        }).catch(reject);
    });

}



/**
 * Close db connection
 */
function closeMongodb() {

    return mongoose.disconnect();

}



/**
 * Close mockgoose connection
 */
function closeMockgoose() {

    return mockgoose.disconnect();

}



module.exports.connectMongodb = connectMongodb;
module.exports.connectMockgoose = connectMockgoose;
module.exports.closeMongodb = closeMongodb;
module.exports.closeMockgoose = closeMockgoose;