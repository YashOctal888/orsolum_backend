import Joi from "joi";

export const subAdminValidate = Joi.object({
    name: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .required()
        .messages({
            "string.base": "Name must be a text value",
            "string.empty": "Name is required",
            "string.min": "Name must be at least 3 characters long",
            "string.max": "Name must not exceed 50 characters",
            "any.required": "Name is required",
        }),

    email: Joi.string()
        .trim()
        .lowercase()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            "string.base": "Email must be a text value",
            "string.empty": "Email is required",
            "string.email": "Please provide a valid email address",
            "any.required": "Email is required",
        }),

    password: Joi.string()
        .min(8)
        .max(30)
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$"))
        .required()
        .messages({
            "string.base": "Password must be a text value",
            "string.empty": "Password is required",
            "string.min": "Password must be at least 8 characters long",
            "string.max": "Password must not exceed 30 characters",
            "string.pattern.base":
                "Password must contain at least one uppercase letter, one lowercase letter, and one number",
            "any.required": "Password is required",
        }),

    role: Joi.string()
        .length(24)
        .hex()
        .required()
        .messages({
            "string.base": "Role must be a valid ID",
            "string.empty": "Role is required",
            "string.length": "Role ID must be 24 characters long",
            "string.hex": "Role ID must be a valid hexadecimal string",
            "any.required": "Role is required",
        }),
}).required();
