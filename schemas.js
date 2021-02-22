const Joi = require("joi");

//We're using JOI so as not to get our FORM circumvent, e.g by POSTMAN
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        // title: Joi.string().allow("") //this approach allows the input to be submitted empty
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})