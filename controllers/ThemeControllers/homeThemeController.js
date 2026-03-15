import Joi from "joi";
import ThemeCategory from "../../models/ThemeCategory.js";
import TrendingPoster from "../../models/TrendingPoster.js";
import PromotionPoster from "../../models/PromotionPoster.js";
import FeaturedCampaign from "../../models/FeaturedCampaign.js";
import { uploadImageToS3 } from "../../helper/s3Uploader.js";

// ==========================================
// Joi Validation Schemas
// ==========================================
const objectIdSchema = Joi.string().hex().length(24).messages({
    "string.hex": "Invalid ID format",
    "string.length": "Invalid ID format"
});

const validators = {
    category: Joi.object({
        name: Joi.string().trim().required().messages({ "any.required": "Category name is required" }),
        icon: Joi.string().trim().required().messages({ "any.required": "Icon is required" }),
        color: Joi.string().trim().required().messages({ "any.required": "Color is required" })
    }),
    trending: Joi.object({
        category: Joi.string().trim().required().messages({ "any.required": "Category name is required" }),
        bgColor: Joi.string().trim().required().messages({ "any.required": "Background color is required" }),
        icon: Joi.string().trim().required().messages({ "any.required": "Icon is required" })
    }),
    promotionButton: Joi.object({
        text: Joi.string().trim().required().messages({ "any.required": "Button text is required" }),
        textColor: Joi.string().trim().optional(),
        bgColor: Joi.string().trim().optional(),
        position: Joi.string().trim().optional(),
        category: Joi.string().allow('').optional()
    }).unknown(true),
    campaignText: Joi.object({
        content: Joi.string().trim().required().messages({ "any.required": "Campaign text content is required" }),
        color: Joi.string().trim().optional(),
        position: Joi.string().trim().optional()
    }).unknown(true)
};


// ==========================================
// 1. Category Themes
// ==========================================
export const CategoryController = {
    index: async (req, res) => {
        try {
            const categories = await ThemeCategory.find().sort({ createdAt: -1 });
            return res.status(200).json({ success: true, data: categories });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },
    create: async (req, res) => {
        try {
            // Validate text body first
            const { error } = validators.category.validate(req.body);
            if (error) return res.status(400).json({ success: false, message: error.details[0].message });

            const { name, icon, color } = req.body;
            let gifUrl = null;

            // Only upload to S3 if validation passes
            if (req.file) {
                gifUrl = await uploadImageToS3(req.file);
            }

            const newCategory = await ThemeCategory.create({ name, icon, color, gif: gifUrl });
            return res.status(201).json({ success: true, data: newCategory });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            const { error } = objectIdSchema.validate(req.params.id);
            if (error) return res.status(400).json({ success: false, message: error.details[0].message });

            await ThemeCategory.findByIdAndDelete(req.params.id);
            return res.status(200).json({ success: true, message: "Category theme deleted" });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};

// ==========================================
// 2. Trending Posters
// ==========================================
export const TrendingController = {
    index: async (req, res) => {
        try {
            const posters = await TrendingPoster.find().sort({ createdAt: -1 });
            return res.status(200).json({ success: true, data: posters });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },
    create: async (req, res) => {
        try {
            // Validate incoming JSON
            const { error } = validators.trending.validate(req.body);
            if (error) return res.status(400).json({ success: false, message: error.details[0].message });

            const newPoster = await TrendingPoster.create(req.body);
            return res.status(201).json({ success: true, data: newPoster });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            const { error } = objectIdSchema.validate(req.params.id);
            if (error) return res.status(400).json({ success: false, message: error.details[0].message });

            await TrendingPoster.findByIdAndDelete(req.params.id);
            return res.status(200).json({ success: true, message: "Trending poster deleted" });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};

// ==========================================
// 3. Promotion Posters
// ==========================================
export const PromotionController = {
    index: async (req, res) => {
        try {
            const promotions = await PromotionPoster.find().sort({ createdAt: -1 });
            return res.status(200).json({ success: true, data: promotions });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },
    create: async (req, res) => {
        try {
            if (!req.file) return res.status(400).json({ success: false, message: "Image is required" });

            // Safely parse JSON to prevent app crashes on malformed data
            let buttonConfig = {};
            try {
                buttonConfig = req.body.buttonConfig ? JSON.parse(req.body.buttonConfig) : {};
            } catch (err) {
                return res.status(400).json({ success: false, message: "Invalid JSON format for buttonConfig" });
            }

            // Validate parsed JSON config
            const { error } = validators.promotionButton.validate(buttonConfig);
            if (error) return res.status(400).json({ success: false, message: error.details[0].message });

            // Upload ONLY after validation passes
            const imageUrl = await uploadImageToS3(req.file);

            const newPromotion = await PromotionPoster.create({
                imageUrl,
                button: buttonConfig
            });

            return res.status(201).json({ success: true, data: newPromotion });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            const { error } = objectIdSchema.validate(req.params.id);
            if (error) return res.status(400).json({ success: false, message: error.details[0].message });

            await PromotionPoster.findByIdAndDelete(req.params.id);
            return res.status(200).json({ success: true, message: "Promotion deleted" });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};

// ==========================================
// 4. Featured Campaigns
// ==========================================
export const CampaignController = {
    index: async (req, res) => {
        try {
            const campaigns = await FeaturedCampaign.find().sort({ createdAt: -1 });
            return res.status(200).json({ success: true, data: campaigns });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },
    create: async (req, res) => {
        try {
            if (!req.file) return res.status(400).json({ success: false, message: "Image is required" });

            // Safely parse JSON
            let textConfig = {};
            try {
                textConfig = req.body.textConfig ? JSON.parse(req.body.textConfig) : {};
            } catch (err) {
                return res.status(400).json({ success: false, message: "Invalid JSON format for textConfig" });
            }

            // Validate parsed JSON config
            const { error } = validators.campaignText.validate(textConfig);
            if (error) return res.status(400).json({ success: false, message: error.details[0].message });

            // Upload ONLY after validation passes
            const imageUrl = await uploadImageToS3(req.file);

            const newCampaign = await FeaturedCampaign.create({
                imageUrl,
                text: textConfig
            });

            return res.status(201).json({ success: true, data: newCampaign });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            const { error } = objectIdSchema.validate(req.params.id);
            if (error) return res.status(400).json({ success: false, message: error.details[0].message });

            await FeaturedCampaign.findByIdAndDelete(req.params.id);
            return res.status(200).json({ success: true, message: "Campaign deleted" });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};