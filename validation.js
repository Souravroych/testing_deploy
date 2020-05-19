//VALIDATIONS
const Joi = require('@hapi/joi');

//FIRST-LOGIN VALIDATION
const firstLoginValidation = data => {
    const schema = Joi.object({
        idcode: Joi.string().min(6).required()
    });
    return schema.validate(data);
}


//REG VALIDATION
const registerValidation = data => {
    const schema = Joi.object({
        idcode: Joi.string().min(6).required(),
        name: Joi.string().min(6).required(),
        email: Joi.string().required().email(),
        password: Joi.string().required()
    });
    return schema.validate(data);
}

//LOGIN VALIDATION
const loginValidation = data => {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required()
    });
    return schema.validate(data);
}

const updateProfile = data => {
    const schema = Joi.object({
        name: Joi.string().min(4).required(),
        location: Joi.string().min(6).required(),
        bio: Joi.string().min(12).required()
    });
    return schema.validate(data);
}

const resetPassword = data => {
    const schema = Joi.object({
        currentPassword: Joi.string().required(),
        newPassword: Joi.string().min(6).required(),
        cnewPassword: Joi.string().required(),
        cnewPassword: Joi.any().valid(Joi.ref('newPassword')).required().label("Passwords are not matching"),
    })
    return schema.validate(data);
}


module.exports.firstLoginValidation = firstLoginValidation;
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.resetPassword = resetPassword;
module.exports.updateProfile = updateProfile;