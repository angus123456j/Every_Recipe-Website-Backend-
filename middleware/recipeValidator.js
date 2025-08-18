const Joi = require("joi");

const createRecipeSchema = Joi.object({
  // "egg123"  123
  title: Joi.string().required(),
  time: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
  description: Joi.string().required(),

  ingredients: Joi.array().items(Joi.string()).required(),
  steps: Joi.array().items(Joi.string()).required(),
  imageURL: Joi.string().uri().optional().allow(null, ''),
  tags: Joi.array().items(Joi.string()),
  // userId is derived from session on the server; do not accept from client
  userId: Joi.forbidden()
});

module.exports = createRecipeSchema;
