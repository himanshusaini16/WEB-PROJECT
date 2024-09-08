const Joi = require('joi');
const review = require('./models/review');
const Listing=require("./models/listing.js");

module.exports.listingSchema=Joi.object({
    Listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        image:Joi.string().allow("",null)
    }).required()
});


module.exports.reviewSchmea=Joi.object({
    review:Joi.object({
       rating:Joi.number().required().min(1).max(5),
       comment:Joi.string().required(),
    }).required(),
})
