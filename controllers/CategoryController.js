import ProductCategory from "../models/OnlineStore/Category.js";
import ProductSubCategory from "../models/OnlineStore/SubCategory.js";
import { createCategorySchema, createSubCategorySchema } from "../validations/category.validator.js";

// ─── Parent Category CRUD ────────────────────────────────────────

const index = async (req, res) => {
    try {
        const { search = "", type = "online" } = req.query;

        const query = {
            deleted: { $ne: true },
            storeType: type,
        };
        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        const categories = await ProductCategory.find(query).sort({ createdAt: -1 });

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

        const { name, image, type } = value;

        const exists = await ProductCategory.findOne({
            name: new RegExp(`^${name}$`, "i"),
            storeType: type,
            deleted: { $ne: true },
        });

        if (exists) {
            return res.status(409).json({
                success: false,
                message: "Category with this name already exists",
            });
        }

        const category = await ProductCategory.create({
            createdBy: req.user._id,
            name,
            image,
            storeType: type,
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
        const category = await ProductCategory.findOne({
            _id: req.params.id,
            deleted: { $ne: true },
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        // Also fetch subcategories
        const subCategories = await ProductSubCategory.find({
            categoryId: category._id,
            deleted: { $ne: true },
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: { ...category.toObject(), subCategories },
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

        const { name, image, type } = value;

        const category = await ProductCategory.findOne({
            _id: req.params.id,
            deleted: { $ne: true },
        });
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        const exists = await ProductCategory.findOne({
            _id: { $ne: req.params.id },
            name: new RegExp(`^${name}$`, "i"),
            storeType: type,
            deleted: { $ne: true },
        });

        if (exists) {
            return res.status(409).json({
                success: false,
                message: "Category with this name already exists",
            });
        }

        category.name = name;
        category.image = image;
        category.storeType = type;

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
        const category = await ProductCategory.findOne({
            _id: req.params.id,
            deleted: { $ne: true },
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        // Soft delete parent and all its subcategories
        category.deleted = true;
        await category.save();

        await ProductSubCategory.updateMany(
            { categoryId: category._id },
            { $set: { deleted: true } }
        );

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

// ─── SubCategory CRUD ────────────────────────────────────────────

const listSubCategories = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { search = "" } = req.query;

        const query = {
            categoryId,
            deleted: { $ne: true },
        };
        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        const subCategories = await ProductSubCategory.find(query).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: subCategories,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch sub-categories",
        });
    }
};

const storeSubCategory = async (req, res) => {
    try {
        const { error, value } = createSubCategorySchema.validate(req.body);
        if (error) {
            return res.status(422).json({
                success: false,
                message: error.details[0].message,
            });
        }

        const { name, image, categoryId, type } = value;

        // Verify parent exists
        const parent = await ProductCategory.findOne({
            _id: categoryId,
            deleted: { $ne: true },
        });
        if (!parent) {
            return res.status(404).json({
                success: false,
                message: "Parent category not found",
            });
        }

        const exists = await ProductSubCategory.findOne({
            name: new RegExp(`^${name}$`, "i"),
            categoryId,
            storeType: type,
            deleted: { $ne: true },
        });

        if (exists) {
            return res.status(409).json({
                success: false,
                message: "Sub-category with this name already exists under this category",
            });
        }

        const subCategory = await ProductSubCategory.create({
            createdBy: req.user._id,
            name,
            image,
            categoryId,
            storeType: type,
        });

        return res.status(201).json({
            success: true,
            message: "Sub-category created successfully",
            data: subCategory,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create sub-category",
        });
    }
};

const updateSubCategory = async (req, res) => {
    try {
        const { error, value } = createSubCategorySchema.validate(req.body);
        if (error) {
            return res.status(422).json({
                success: false,
                message: error.details[0].message,
            });
        }

        const { name, image, categoryId, type } = value;

        const subCategory = await ProductSubCategory.findOne({
            _id: req.params.id,
            deleted: { $ne: true },
        });
        if (!subCategory) {
            return res.status(404).json({
                success: false,
                message: "Sub-category not found",
            });
        }

        const exists = await ProductSubCategory.findOne({
            _id: { $ne: req.params.id },
            name: new RegExp(`^${name}$`, "i"),
            categoryId,
            storeType: type,
            deleted: { $ne: true },
        });

        if (exists) {
            return res.status(409).json({
                success: false,
                message: "Sub-category with this name already exists under this category",
            });
        }

        subCategory.name = name;
        subCategory.image = image;
        subCategory.categoryId = categoryId;
        subCategory.storeType = type;

        await subCategory.save();

        return res.status(200).json({
            success: true,
            message: "Sub-category updated successfully",
            data: subCategory,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update sub-category",
        });
    }
};

const destroySubCategory = async (req, res) => {
    try {
        const subCategory = await ProductSubCategory.findOne({
            _id: req.params.id,
            deleted: { $ne: true },
        });

        if (!subCategory) {
            return res.status(404).json({
                success: false,
                message: "Sub-category not found",
            });
        }

        subCategory.deleted = true;
        await subCategory.save();

        return res.status(200).json({
            success: true,
            message: "Sub-category deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete sub-category",
        });
    }
};

export default {
    index,
    store,
    show,
    update,
    destroy,
    listSubCategories,
    storeSubCategory,
    updateSubCategory,
    destroySubCategory,
};
