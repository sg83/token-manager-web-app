const router = require("express").Router();
const User = require("./../models/Users");
const Token = require("./../models/Tokens");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const config = require('./../config');



/**
 * Check if user exists
 * @param {String} email - The email ID
 * @return {Object} user - The response includes status and message
 */
const checkUserExists = async( email ) => {
    const user = await User.findOne({ email: email });
    if (user) return user;
    return null;
};



/**
 * Generate a new JWT Token on successful login
 * @param {Object} request - The request object
 * @param {Object} user    - The user object
 * @param {String} secret  - The JWT Token secret
 * @return {Sting} jwtToken- The JWT Token
 */
const generateJWTToken = async( request, user, secret ) => {

    const passwdCompare = await bcrypt.compare(request.body.password, user.password);

    if (!passwdCompare) {
        return null;
    }

    //Create and assign a token
    const jwtToken = jwt.sign(
        { _id: user._id }, 
        secret
    );

    return jwtToken;
};



/**
 * Create a new user during register operation
 * @param {Object} request - The request object
 * @param {String} passwordHash  - The JWT password hash
 * @return {Object} user- The user object, null if not created
 */
const createUser = async( request, passwordHash  ) => {

    const user = await new User({
            name: request.body.name,
            email: request.body.email,
            password: passwordHash
        }).save();

    return user;

};



/**
 * Delete a user
 * @param {String} email  - The email of the user
 * @return {Object} user- The user object, null if not found
 */
const deleteUser = async( email  ) => {

    const user =  await User.deleteOne({email : email});
    return user;
  
};



/**
 * Authenticate the user
 * @param {Object} request - The request object
 * @param {Object} response - The response object
 * @return {Object} response - The response includes status and  message
 */
const requestAuthentication = async( request, response, next  ) => {

    try {

        const jwtToken = request.headers.authorization.split(" ")[1];
        request.userData = jwt.verify(
            jwtToken, 
            config.TOKEN_SECRET
        );
        next();
        
    } catch (error) {
        return response.status(403).json({message: 'Invalid JWT Token.' });
    }

};



module.exports.checkUserExists = checkUserExists;
module.exports.generateJWTToken = generateJWTToken;
module.exports.createUser = createUser;
module.exports.deleteUser = deleteUser;
module.exports.requestAuthentication = requestAuthentication;
