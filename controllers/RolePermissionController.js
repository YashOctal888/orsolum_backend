import Roles from '../models/Roles.js';
import Admin from "../models/Admin.js";
import Permissions from "../models/Permissions.js";

const roles = async (req,res) => {
    try {
        const roles = await Roles.find({});

        return res.status(200).json({
            success: true,
            message: "Roles fetched successfully",
            data: roles
        });
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success: false,
            message: "Error fetching roles",
            error: err.message
        })
    }
}

const permissions = async (req, res) => {
    try {
        const permissions = await Permissions.find({});

        return res.status(200).json({
            success: true,
            message: "Permissions fetched successfully",
            data: permissions
        });
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success: false,
            message: "Error fetching permissions",
            error: err.message
        })
    }
}

const createRole = async (req, res) => {
    try {
        const {name, permissions} = req.body;

        const role = new Roles({
            name,
            permissions
        });

        await role.save();

        return res.status(201).json({
            success: true,
            message: "Role created successfully",
            data: role
        });
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success: false,
            message: "Error creating role",
            error: err.message
        })
    }
}

const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, permissions } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Role ID is required",
            });
        }

        // Build update object safely
        const updateData = {};
        if (typeof name === "string" && name.trim()) {
            updateData.name = name.trim();
        }
        if (Array.isArray(permissions)) {
            updateData.permissions = permissions;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Nothing to update",
            });
        }

        const role = await Roles.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Role updated successfully",
            data: role,
        });

    } catch (error) {
        console.error("Update Role Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const getRoleById = async (req, res) => {
    try {
        const {id} = req.params;
        if (!id) return res.status(404).send({
            success: false,
            message: "Role ID is required"
        })
        const role = await Roles.findById(id);

        return res.status(200).json({
            success: true,
            message: "Role fetched successfully",
            data: role
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
}

const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;

        // Check role exists
        const role = await Roles.findById(id);
        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found",
            });
        }

        // Delete all admins having this role
        await Admin.deleteMany({ role: id });

        // Delete role
        await Roles.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Role and associated admins deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};

export default {
    roles,
    createRole,
    updateRole,
    getRoleById,
    deleteRole,
    permissions
}