'use strict';

const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const User = require("./../models/Users");
const Token = require("./../models/Tokens");
const config = require('./../config');



/**
 * Checks if the API token exists
 * @param {String} tokenId - The ID of the API token
 * @return {Object} token - The matching API token object, null if not found
 */
const checkAPITokenExists = async( tokenId ) => {

    const token = await Token.findOne({ _id: tokenId });
    return token;

};



/**
 * Checks if API token is active and not expired
 * @param {String} tokenId - The ID of the API token
 * @return {Object} token - The matching API token object, null if not found
 */
const isAPITokenActive = async( tokenId ) => {

    const token = await checkAPITokenExists(tokenId);

    if(!token) return "TOKEN_NOT_FOUND";
    if(!token.status) return "TOKEN_NOT_ACTIVE";
    if((Date.parse(token.validTo) < Date.now() )) return "TOKEN_EXPIRED";
    
    return "OK";
};



/**
 * Updates API token object
 * @param {Object} request - The request object
 * @return {Object} token - The matching API token object, null if not found
 */
const patchToken = async( request  ) => {

    var token =  await Token.findOne({ _id: request.params.tokenId });

    var status = request.body.status;
    var validTo = null;
    (status && !token.status) ? validTo = Date.now() + config.API_TOKEN_EXPIRES_IN : validTo = token.validTo;

    var name = null;
    (!request.body.name) ? name = token.name : name = request.body.name;

    var description = null;
    (!request.body.description) ? description = token.description : description = request.body.description;

    token = await Token.updateOne(
        { _id : request.params.tokenId }, 
        { $set: { 
            status: status,
            validTo: validTo,
            name: name,
            description: description
        }
    });

    token =  await Token.findOne({ _id: request.params.tokenId });
    return token;

};



/**
 * Create a new API token object
 * @param {Object} request - The request object
 * @return {Object} token - The new API token object created, null if not created
 */
const generateToken = async( request  ) => {

    const newToken = new Token({
      name: request.body.name,
      description: request.body.description
    });
    const token = await newToken.save();
    return token;

};



/**
 * Get a list of existing API token object
 * @param {Object} request - The request object
 * @return {Object} tokens - The list of tokens, null if not found
 */
const listTokens = async( request  ) => {

    const tokens = await Token.find();
    return tokens;
 
};



/**
 * Get details of the API token object
 * @param {Object} request - The request object
 * @return {Object} token - The matching API token object, null if not found
 */
const getToken = async( request  ) => {

    const token =  await checkAPITokenExists(request.params.tokenId);
    return token;

};



/**
 * Delete the API token object
 * @param {Object} request - The request object
 * @return {Object} token - The deleted API token object, null if not found
 */
const deleteToken = async( request  ) => {

    const token =  await Token.deleteOne({_id : request.params.tokenId});
    return token;

};



module.exports.generateToken = generateToken;
module.exports.checkAPITokenExists = checkAPITokenExists;
module.exports.isAPITokenActive = isAPITokenActive;
module.exports.patchToken = patchToken;
module.exports.listTokens = listTokens;
module.exports.getToken = getToken;
module.exports.deleteToken = deleteToken;