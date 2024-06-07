import Joi from "joi";

export const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .error(() => new Error("Email and password are required")),
  password: Joi.string()
    .min(4)
    .max(30)
    .required()
    .error(() => new Error("Email and password are required")),
  subscription: Joi.string(),
  token: Joi.string(),
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .error(() => new Error("Enter your email and password")),
  password: Joi.string()
    .min(4)
    .max(30)
    .required()
    .error(() => new Error("Enter your email and password")),
});

export const subscriptionSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

export const verifySchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
});
