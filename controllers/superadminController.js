import {jsonStatus, status} from '../helper/api.responses.js';
import {generateToken} from '../helper/generateToken.js';
import {catchError} from '../helper/service.js';
import Admin from '../models/Admin.js';
import PaymentConfigurations from "../models/PaymentConfigurations.js";
import {paymentConfigValidation} from "../validations/Payment.js";
import {subAdminValidate} from "../validations/User.js";
import bcrypt from 'bcrypt';
import Roles from "../models/Roles.js";

export const loginSuperadmin = async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(status.BadRequest).json({
                status: jsonStatus.BadRequest,
                success: false,
                message: "Please enter credentials",
            });
        }

        const admin = await Admin.findOne({email}).populate({
            path: "role"
        });

        if (!admin) {
            return res.status(status.Unauthorized).json({
                status: jsonStatus.Unauthorized,
                success: false,
                message: "Invalid credentials (email not found)",
            });
        }

        const checkPass = bcrypt.compareSync(password, admin.password);

        if (!checkPass) {
            return res.status(status.Unauthorized).json({
                status: jsonStatus.Unauthorized,
                success: false,
                message: "Invalid credentials (password mismatch)",
            });
        }

        const token = generateToken(admin._id);

        res.status(status.OK).json({
            status: jsonStatus.OK,
            success: true,
            token,
            role: admin.role,
        });
    } catch (error) {
        console.error("❌ loginSuperadmin error:", error.message);
        res.status(status.InternalServerError).json({
            status: jsonStatus.InternalServerError,
            success: false,
            message: error.message,
        });
        return catchError("loginSuperadmin", error, req, res);
    }
};

export const me = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        return res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error("ME API ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user",
        });
    }
};

export const getPaymentConfigurations = async (req, res) => {
    try {
        const config = await PaymentConfigurations.findOne({type: "global"});

        res.status(status.OK).json({
            status: jsonStatus.OK,
            success: true,
            data: {
                platform_fee: config?.platform_fee ?? 0,
                delivery_charges: config?.delivery_charges ?? 0,
                gst_percentage: config?.gst_percentage ?? 0,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(status.InternalServerError).json({
            status: jsonStatus.InternalServerError,
            success: false,
            message: error.message || "Failed to load configurations",
        });
    }
};

export const savePaymentConfigurations = async (req, res) => {
    try {
        const {error, value} = paymentConfigValidation.validate(req.body, {
            abortEarly: false,
        });

        if (error) {
            return res.status(status.BadRequest).json({
                status: jsonStatus.BadRequest,
                success: false,
                message: error.details[0].message,
            });
        }

        const {platform_fee, delivery_charges, gst_percentage} = value;

        let config = await PaymentConfigurations.findOne({type: "global"});

        if (config) {
            // 🔹 Update existing
            config.platform_fee = platform_fee;
            config.delivery_charges = delivery_charges;
            config.gst_percentage = gst_percentage;

            await config.save();
        } else {
            config = await PaymentConfigurations.create({
                type: "global",
                platform_fee,
                delivery_charges,
                gst_percentage,
            });
        }

        return res.status(status.OK).json({
            status: jsonStatus.OK,
            success: true,
            message: "Payment configurations saved successfully",
            data: {
                platform_fee: config?.platform_fee ?? 0,
                delivery_charges: config?.delivery_charges ?? 0,
                gst_percentage: config?.gst_percentage ?? 0,
            },
        });

    } catch (error) {
        console.log(error);
        return res.status(status.InternalServerError).json({
            status: jsonStatus.InternalServerError,
            success: false,
            message: error.message || "Failed to save configurations",
        });
    }
};

export const staffMembers = async (req, res) => {
    try {
        const admins = await Admin.find({}).select("-password")
            .populate('role', 'name');

        return res.status(200).json({
            success: true,
            message: "Sub-admin list fetched successfully",
            data: admins,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};

export const createStaffMember = async (req, res) => {
  try {
    const { error, value } = subAdminValidate.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(status.BadRequest).json({
        status: jsonStatus.BadRequest,
        success: false,
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }

    const alreadyExistAdmin = await Admin.exists({ email: value.email });
    if (alreadyExistAdmin) {
      return res.status(status.BadRequest).json({
        status: jsonStatus.BadRequest,
        success: false,
        message: "Admin with this email already exists",
      });
    }

    const role = await Roles.findById(value.role);
    if (!role) {
      return res.status(status.BadRequest).json({
        status: jsonStatus.BadRequest,
        success: false,
        message: "Role not found",
      });
    }

    const subAdmin = await Admin.create({
      name: value.name,
      email: value.email,
      password: value.password,
      role: role._id,
    });

    // 5️⃣ Success response
    return res.status(status.Create).json({
      status: jsonStatus.Create,
      success: true,
      message: "Sub-admin created successfully",
      data: subAdmin,
    });

  } catch (error) {
    console.error(error);
    return res.status(status.InternalServerError).json({
      status: jsonStatus.InternalServerError,
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const editStaffMember = async (req, res) => {
    try {
        const { id } = req.params;

        const { error, value } = subAdminValidate.validate(req.body, {
            abortEarly: false,
        });

        if (error) {
            return res.status(status.BadRequest).json({
                status: jsonStatus.BadRequest,
                success: false,
                message: "Validation failed",
                errors: error.details.map((err) => err.message),
            });
        }

        // 1️⃣ Check staff exists
        const existingAdmin = await Admin.findById(id);
        if (!existingAdmin) {
            return res.status(status.NotFound).json({
                status: jsonStatus.NotFound,
                success: false,
                message: "Staff member not found",
            });
        }

        // 2️⃣ Check email uniqueness (exclude self)
        const emailExists = await Admin.findOne({
            email: value.email,
            _id: { $ne: id },
        });

        if (emailExists) {
            return res.status(status.BadRequest).json({
                status: jsonStatus.BadRequest,
                success: false,
                message: "Admin with this email already exists",
            });
        }

        // 3️⃣ Check role exists
        const role = await Roles.findById(value.role);
        if (!role) {
            return res.status(status.BadRequest).json({
                status: jsonStatus.BadRequest,
                success: false,
                message: "Role not found",
            });
        }

        // 4️⃣ Update staff
        const updatedAdmin = await Admin.findByIdAndUpdate(
            id,
            {
                name: value.name,
                email: value.email,
                password: value.password, // hash if required
                role: role._id,
            },
            { new: true }
        );

        // 5️⃣ Success response
        return res.status(status.OK).json({
            status: jsonStatus.OK,
            success: true,
            message: "Staff member updated successfully",
            data: updatedAdmin,
        });

    } catch (error) {
        console.error(error);
        return res.status(status.InternalServerError).json({
            status: jsonStatus.InternalServerError,
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};