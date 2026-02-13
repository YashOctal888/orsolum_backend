import Joi from "joi";

export const paymentConfigValidation = Joi.object({
    platform_fee: Joi.number()
        .min(0)
        .required()
        .messages({
            "number.base": "Platform fee must be a number",
            "number.min": "Platform fee must be positive",
            "any.required": "Platform fee is required",
        }),

    delivery_charges: Joi.number()
        .min(0)
        .required()
        .messages({
            "number.base": "Delivery charges must be a number",
            "number.min": "Delivery charges must be positive",
            "any.required": "Delivery charges are required",
        }),

    gst_percentage: Joi.number()
        .min(0)
        .max(100)
        .required()
        .messages({
            "number.base": "GST percentage must be a number",
            "number.min": "GST percentage must be positive",
            "number.max": "GST percentage cannot exceed 100",
            "any.required": "GST percentage is required",
        }),
});
