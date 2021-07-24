'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortId = require('shortid');
const mongoosePaginate = require('mongoose-paginate')
const validator = require('validator');
const config = require('./../config');



/**
 * Create schema definition for token object
 */
var tokenSchema = new Schema({

    _id: {
        type: String,
        unique: true,
        index: true,
        min: config.TOKENID_MIN_LENGHT,
        max: config.TOKENID_MAX_LENGHT,
        default: shortId.generate
    },

    createdAt: {
        type: Date,
        default: Date.now,
        required: 'Creation date is mandatory'
    },

    validTo: {
        type: Date,
        default: () => new Date(+new Date() + config.API_TOKEN_EXPIRES_IN),
        required: 'Expiry date is mandatory. Default value is the `creation_date` + 7 days'
    },

    status: {
        type: Boolean,
        default: true,
        required: 'Must have a status value - default is true'
    },

    name: {
        type: String,
        default: '',
        min: config.DEFAULT_MIN_LENGHT,
        max: config.DEFAULT_MAX_LENGHT,
    },

    description: {
        type: String,
        default: '',
        min: config.DEFAULT_MIN_LENGHT,
        max: config.DEFAULT_MAX_LENGHT,
    }

});

tokenSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Tokens', tokenSchema);
