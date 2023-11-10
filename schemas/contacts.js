const Joi = require("joi");
const validateSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .regex(/^[0-9]{10}$/)
    .required(),
});
const putSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string().regex(/^[0-9]{10}$/),
});

module.exports = { validateSchema, putSchema };
