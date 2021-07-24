//VALIDATION
const Joi = require("joi");
const config = require("../config.js")


const userRegisterRequestValidation = (requestData) => {

    const schema = Joi.object({

        email: Joi.string().min(config.EMAIL_MIN_LENGHT).max(config.EMAIL_MAX_LENGHT).required().email(),
        password: Joi.string().min(config.DEFAULT_MIN_LENGHT).max(config.DEFAULT_MAX_LENGHT).required(),
        name: Joi.string().min(config.DEFAULT_MIN_LENGHT).max(config.DEFAULT_MAX_LENGHT).required()

    });

    return schema.validate(requestData);
};


const userLoginRequestValidation = (requestData) => {

    const schema = Joi.object({

        email: Joi.string().min(config.EMAIL_MIN_LENGHT).max(config.EMAIL_MAX_LENGHT).required().email(),
        password: Joi.string().min(config.DEFAULT_MIN_LENGHT).max(config.DEFAULT_MAX_LENGHT).required()

    });

    return schema.validate(requestData);
};


const tokenRequestDataValidation = (requestData) => {

    const schema = Joi.object({

        name: Joi.string().min(config.DEFAULT_MIN_LENGHT).max(config.DEFAULT_MAX_LENGHT),
        description: Joi.string().min(config.DEFAULT_MIN_LENGHT).max(config.DEFAULT_MAX_LENGHT),
        status: Joi.boolean().required(),
        validTo: Joi.date()

    });

    return schema.validate(requestData);
};


const tokenIdValidation = (requestData) => {

    const schema = Joi.object({

        tokenId: Joi.string().min(config.TOKENID_MIN_LENGHT).max(config.TOKENID_MAX_LENGHT)

    });

    return schema.validate(requestData);
};


module.exports.userRegisterRequestValidation = userRegisterRequestValidation;
module.exports.userLoginRequestValidation = userLoginRequestValidation;
module.exports.tokenRequestDataValidation = tokenRequestDataValidation;
module.exports.tokenIdValidation = tokenIdValidation;