const Joi = require('joi');

const signUpSchema = Joi.object({
    username: Joi.string()
        .required()
        .min(3)
        .max(30)
        .alphanum()
        .messages({
            'string.empty': 'Username is required',
            'string.min': 'Username must be at least 3 characters long',
            'string.max': 'Username must be less than 30 characters',
            'string.alphanum': 'Username can only contain letters and numbers'
        }),
    password: Joi.string()
        .required()
        .min(8)
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 8 characters long'
        }),
    email: Joi.string()
        .required()
        .email()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please provide a valid email address'
        })
});

const loginSchema = Joi.object({
    username: Joi.string()
        .required()
        .messages({
            'string.empty': 'Username is required'
        }),
    password: Joi.string()
        .required()
        .messages({
            'string.empty': 'Password is required'
        })
});

module.exports = {
    signUpSchema,
    loginSchema
};



