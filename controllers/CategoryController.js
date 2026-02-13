import Category from "../models/Category.js";
import { createCategorySchema } from "../validations/category.validator.js";

const index = async (req, res) => {
    try {
        const { search = "", type = "online" } = req.query;

        const query = {
            type,
            $or: [
                { category_name: { $regex: search, $options: "i" } },
                { sub_category_name: { $regex: search, $options: "i" } },
            ],
        };

        const categories = await Category.find(query)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
        });
    }
};

const store = async (req, res) => {
    try {
        const { error, value } = createCategorySchema.validate(req.body);
        if (error) {
            return res.status(422).json({
                success: false,
                message: error.details[0].message,
            });
        }

        const { category_name, sub_category_name, image, type } = value;

        const exists = await Category.findOne({
            category_name: new RegExp(`^${category_name}$`, "i"),
            sub_category_name: new RegExp(`^${sub_category_name}$`, "i"),
            type,
        });

        if (exists) {
            return res.status(409).json({
                success: false,
                message: "Category with this sub-category already exists",
            });
        }

        const category = await Category.create({
            user_id: req.user._id, // assuming superadmin auth
            category_name,
            sub_category_name,
            image,
            type,
        });

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create category",
        });
    }
};

const show = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: category,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch category",
        });
    }
};

const update = async (req, res) => {
    try {
        const { error, value } = createCategorySchema.validate(req.body);
        if (error) {
            return res.status(422).json({
                success: false,
                message: error.details[0].message,
            });
        }

        const { category_name, sub_category_name, image, type } = value;

        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        const exists = await Category.findOne({
            _id: { $ne: req.params.id },
            category_name: new RegExp(`^${category_name}$`, "i"),
            sub_category_name: new RegExp(`^${sub_category_name}$`, "i"),
            type,
        });

        if (exists) {
            return res.status(409).json({
                success: false,
                message: "Category with this sub-category already exists",
            });
        }

        category.category_name = category_name;
        category.sub_category_name = sub_category_name;
        category.image = image;
        category.type = type;

        await category.save();

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update category",
        });
    }
};


const destroy = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        await category.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete category",
        });
    }
};

export default {
    index,
    store,
    show,
    update,
    destroy,
};
