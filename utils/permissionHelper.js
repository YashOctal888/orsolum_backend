export const hasPermission = (
    rolePermissions = [],
    module,
    subModule = null,
    action = "view"
) => {
    return rolePermissions.some((perm) => {
        if (perm.module !== module) return false;

        // module-level permission
        if (!subModule && !perm.sub_module) {
            return perm.permissions.includes(action);
        }

        // sub-module permission
        if (subModule && perm.sub_module === subModule) {
            return perm.permissions.includes(action);
        }

        return false;
    });
};
