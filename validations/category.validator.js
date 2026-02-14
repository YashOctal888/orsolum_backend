import Joi from "joi";

export const createCategorySchema = Joi.object({
    name: Joi.string().trim().min(2).required(),
    image: Joi.string().required(),
    type: Joi.string().valid("online", "local").required(),
});

export const createSubCategorySchema = Joi.object({
    name: Joi.string().trim().min(2).required(),
    image: Joi.string().required(),
    categoryId: Joi.string().required(),
    type: Joi.string().valid("online", "local").required(),
});
