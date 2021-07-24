const router = require("express").Router();
const User = require("./../models/Users");
const Token = require("./../models/Tokens");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const config = require('./../config');


const verifyJWTToken = (req, res) => {

    try {
        const jwtToken = req.headers.authorization.split(" ")[1];
        req.userData = jwt.verify(jwtToken, config.TOKEN_SECRET);;
        next();
    } catch (error) {
        return res.status(404).json({message: 'Invalid JWT Token.' });
    }

};



const checkUserExists = async( email ) => {
    const user = await User.findOne({ email: email });
    if (user) return user;
    return null;
};



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



const createUser = async( request, passwordHash  ) => {

    const user = await new User({
            name: request.body.name,
            email: request.body.email,
            password: passwordHash
        }).save();

    return user;

};



const deleteUser = async( email  ) => {

    const user =  await User.deleteOne({email : email});
    return user;
  
};



const requestAuthentication = async( request, response, next  ) => {

    try {

        const jwtToken = request.headers.authorization.split(" ")[1];
        request.userData = jwt.verify(
            jwtToken, 
            config.TOKEN_SECRET
        );
        next();
        
    } catch (error) {
        console.error("Verify jwtToken: Invalid JWT Token");
        return response.status(403).json({message: 'Invalid JWT Token.' });
    }

};



module.exports.checkUserExists = checkUserExists;
module.exports.verifyJWTToken = verifyJWTToken;
module.exports.generateJWTToken = generateJWTToken;
module.exports.createUser = createUser;
module.exports.deleteUser = deleteUser;
module.exports.requestAuthentication = requestAuthentication;
