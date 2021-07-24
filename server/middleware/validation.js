const Joi = require("joi");
const config = require("../config.js")



/**
 * Validate input fields for /api/user/register api
 * @param {Object} request - The request object
 * @return {Object} request - The request object on successful validation
 */
const userRegisterRequestValidation = (request) => {

    const schema = Joi.object({

        email: Joi.string().min(config.EMAIL_MIN_LENGHT).max(config.EMAIL_MAX_LENGHT).required().email(),
        password: Joi.string().min(config.DEFAULT_MIN_LENGHT).max(config.DEFAULT_MAX_LENGHT).required(),
        name: Joi.string().min(config.DEFAULT_MIN_LENGHT).max(config.DEFAULT_MAX_LENGHT).required()

    });

    return schema.validate(request);
};



/**
 * Validate input fields for /api/user/login api
 * @param {Object} request - The request object
 * @return {Object} request - The request object on successful validation
 */
const userLoginRequestValidation = (request) => {

    const schema = Joi.object({

        email: Joi.string().min(config.EMAIL_MIN_LENGHT).max(config.EMAIL_MAX_LENGHT).required().email(),
        password: Joi.string().min(config.DEFAULT_MIN_LENGHT).max(config.DEFAULT_MAX_LENGHT).required()

    });

    return schema.validate(request);
};



/**
 * Validate input fields for /api/user/register api
 * @param {Object} request - The request object
 * @return {Object} request - The request object on successful validation
 */
const tokenRequestDataValidation = (request) => {

    const schema = Joi.object({

        name: Joi.string().min(config.DEFAULT_MIN_LENGHT).max(config.DEFAULT_MAX_LENGHT),
        description: Joi.string().min(config.DEFAULT_MIN_LENGHT).max(config.DEFAULT_MAX_LENGHT),
        status: Joi.boolean().required(),
        validTo: Joi.date()

    });

    return schema.validate(request);
};



/**
 * Validate input fields for /api/token/:tokenId api
 * @param {Object} request - The request object
 * @return {Object} request - The request object on successful validation
 */
const tokenIdValidation = (request) => {

    const schema = Joi.object({

        tokenId: Joi.string().min(config.TOKENID_MIN_LENGHT).max(config.TOKENID_MAX_LENGHT)

    });

    return schema.validate(request);
};



module.exports.userRegisterRequestValidation = userRegisterRequestValidation;
module.exports.userLoginRequestValidation = userLoginRequestValidation;
module.exports.tokenRequestDataValidation = tokenRequestDataValidation;
module.exports.tokenIdValidation = tokenIdValidation;