const Joi = require("joi");

const authSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .default("starter"),
});
const subscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .default("starter")
    .required(),
});
const updateAvatarSchema = Joi.object({
  avatar: Joi.string().required(),
});
const updateVerifyStatusEmail = Joi.object({
  email: Joi.string().email().required(),
});

module.exports = {
  authSchema,
  subscriptionSchema,
  updateAvatarSchema,
  updateVerifyStatusEmail,
};
