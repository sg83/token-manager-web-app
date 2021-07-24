const mongoose = require("mongoose");
const config = require('./../config');



/**
 * Create schema definition for user object
 */
const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    min: config.DEFAULT_MIN_LENGHT,
    max: config.DEFAULT_MAX_LENGHT,
    required: 'User account name is mandatory!'
  },

  email: {
    type: String,
    required: true,
    min: config.DEFAULT_MIN_LENGHT,
    max: config.DEFAULT_MAX_LENGHT,
    unique: true,
    index: true,
    required: 'User email is mandatory!',
  },

  password: {
    type: String,
    required: true,
    min: config.DEFAULT_MIN_LENGHT,
    max: config.DEFAULT_MAX_LENGHT,
    required: 'User account password is mandatory!'
  },

  creation_date: {
    type: Date,
    default: Date.now
  },

  status: {
    type: String,
    default: 'y',
    min: 1,
    max: 1,
    lowercase: true
  }

});

module.exports = mongoose.model("Users", userSchema);
