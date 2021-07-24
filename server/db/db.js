const mongoose = require('mongoose');
const config = require('./../config');
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);


function connectMongodb() {
    return new Promise((resolve, reject) => {
        mongoose.connect(
            config.MONGO_URI,
            { useNewUrlParser: true, 
                useCreateIndex: true 
            }).then((res, err) => {
                if (err) return reject(err);
                resolve();
            })
    });
}


function connectMockgoose() {
    return new Promise((resolve, reject) => {
        mockgoose.prepareStorage()
            .then(() => {
                mongoose.connect(
                    config.MONGO_URI,
                    { useNewUrlParser: true, 
                        useCreateIndex: true 
                    }).then((res, err) => {
                        if (err) return reject(err);
                        resolve();
                })
          })
    });
}

function close() {

    return mongoose.disconnect();

}

module.exports.connectMongodb = connectMongodb;
module.exports.connectMockgoose = connectMockgoose;
module.exports.close = close;
