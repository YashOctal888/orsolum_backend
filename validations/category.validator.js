import Joi from "joi";

export const createCategorySchema = Joi.object({
    category_name: Joi.string().trim().min(2).required(),
    sub_category_name: Joi.string().trim().min(2).required(),
    image: Joi.string().required(),
    type: Joi.string().valid("online", "local").required(),
});
