'use strict';

const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const User = require("./../models/Users");
const Token = require("./../models/Tokens");
const config = require('./../config');



const checkAPITokenExists = async( tokenId ) => {
    
    const token = await Token.findOne({ _id: tokenId });
    return token;
};



const isAPITokenActive = async( tokenId ) => {

    const token = await checkAPITokenExists(tokenId);

    if(!token) return "TOKEN_NOT_FOUND";
    if(!token.status) return "TOKEN_NOT_ACTIVE";
    if((Date.parse(token.validTo) < Date.now() )) return "TOKEN_EXPIRED";
    
    return "OK";
};



const patchToken = async( request  ) => {

    var token =  await Token.findOne({ _id: request.params.tokenId });

    var status = null;
    var validTo = null;
    status = request.body.status;
    status ? validTo = Date.now() + config.API_TOKEN_EXPIRES_IN : validTo = Date.now();
 
    token = await Token.updateOne(
        { _id : request.params.tokenId }, 
        { $set: { 
            status: status,
            validTo: validTo
        }
    });

    token =  await Token.findOne({ _id: request.params.tokenId });
    return token;

};



const generateToken = async( request  ) => {

    const token = new Token({
      name: request.body.name,
      description: request.body.description
    });
    const newToken = await token.save();
    return newToken;

};



const listTokens = async( request  ) => {

    const tokens = await Token.find();
    return tokens;
 
};



const getToken = async( request  ) => {

  const token =  await checkAPITokenExists(request.params.tokenId);
  return token;

};



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