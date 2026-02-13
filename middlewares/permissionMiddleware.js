import { hasPermission } from "../utils/permissionHelper.js";

export const checkPermission =
    (module, subModule = null, action = "view") =>
        (req, res, next) => {
            try {
                const admin = req.admin; // from auth middleware

                if (!admin || !admin.role || !admin.role.permissions) {
                    return res.status(403).json({
                        success: false,
                        message: "Access denied",
                    });
                }

                const allowed = hasPermission(
                    admin.role.permissions,
                    module,
                    subModule,
                    action
                );

                if (!allowed) {
                    return res.status(403).json({
                        success: false,
                        message: "You do not have permission to perform this action",
                    });
                }

                next();
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: "Permission check failed",
                });
            }
        };
