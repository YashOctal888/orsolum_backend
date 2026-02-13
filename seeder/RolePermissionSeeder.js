import Roles from "../models/Roles.js";
import Permissions from "../models/Permissions.js";
import Admin from "../models/Admin.js";

const RolesPermissionsSeeder = async () => {
    const permissions = [
        {
            module: 'users',
            sub_module: null,
            permissions: ['view'],
        },
        {
            module: 'staff_management',
            sub_module: 'staff_members',
            permissions: ['view', 'create', 'edit', 'delete'],
        },
        {
            module: 'staff_management',
            sub_module: 'role_permission',
            permissions: ['view', 'create', 'edit', 'delete'],
        },
        {
            module: 'seller_store',
            sub_module: null,
            permissions: ['view', 'verify/unverify', 'delete'],
        },
        {
            module: 'seller_products',
            sub_module: null,
            permissions: ['view', 'verify/unverify', 'delete'],
        },
        {
            module: 'store_category',
            sub_module: null,
            permissions: ['view', 'create', 'edit', 'delete'],
        },
        {
            module: 'local_popular_category',
            sub_module: null,
            permissions: ['view', 'create', 'edit', 'delete'],
        },
        {
            module: 'local_store',
            sub_module: null,
            permissions: ['view', 'verify/unverify', 'delete'],
        },
        {
            module: 'local_products',
            sub_module: null,
            permissions: ['view', 'create', 'edit', 'delete'],
        },
        {
            module: 'local_orders',
            sub_module: null,
            permissions: ['view', 'create', 'edit', 'delete'],
        },
        {
            module: 'return_orders',
            sub_module: null,
            permissions: ['view', 'create', 'edit', 'delete'],
        },
        {
            module: 'payment',
            sub_module: "payment_history",
            permissions: ['view', 'create', 'edit', 'delete'],
        },
        {
            module: 'payment',
            sub_module: "payment_configurations",
            permissions: ['view', 'create', 'edit', 'delete'],
        },
        {
            module: 'offers',
            sub_module: null,
            permissions: ['view', 'create', 'edit', 'delete'],
        },
        {
            module: 'coupons',
            sub_module: null,
            permissions: ['view', 'create', 'edit', 'delete'],
        },
        {
            module: 'donations',
            sub_module: null,
            permissions: ['view', 'create', 'edit', 'delete'],
        },
        {
            module: 'coin_management',
            sub_module: null,
            permissions: ['view', 'create', 'edit', 'delete'],
        },
        {
            module: 'notifications',
            sub_module: null,
            permissions: ['view', 'create', 'edit', 'delete'],
        },
        {
            module: 'ads_managements',
            sub_module: null,
            permissions: ['view', 'create', 'edit', 'delete'],
        },
        {
            module: 'admin_store',
            sub_module: null,
            permissions: ['view', 'create', 'edit', 'delete'],
        },
        {
            module: 'admin_store_products',
            sub_module: null,
            permissions: ['view', 'create', 'edit', 'delete'],
        },
        {
            module: 'help_center',
            sub_module: null,
            permissions: ['view', 'create', 'edit', 'delete'],
        },
        {
            module: 'theme_settings',
            sub_module: null,
            permissions: ['view', 'create', 'edit', 'delete'],
        },
        {
            module: 'online_products',
            sub_module: "online_orders",
            permissions: ['view', 'create', 'edit', 'delete'],
        },
        {
            module: 'online_products',
            sub_module: "products",
            permissions: ['view', 'create', 'edit', 'delete'],
        },
        {
            module: 'online_products',
            sub_module: "trending_products",
            permissions: ['view', 'create', 'edit', 'delete'],
        },
        {
            module: 'online_products',
            sub_module: "popular_category",
            permissions: ['view', 'create', 'edit', 'delete'],
        },
        {
            module: 'online_products',
            sub_module: "category",
            permissions: ['view', 'create', 'edit', 'delete'],
        },
        {
            module: 'online_products',
            sub_module: "sub_category",
            permissions: ['view', 'create', 'edit', 'delete'],
        },
    ];

    try {
        // Clear old data
        await Permissions.deleteMany({});
        await Roles.deleteMany({});

        // Insert all permissions
        const databasePermissions = await Permissions.insertMany(permissions);

        // Super Admin gets ALL permissions
        const superAdminPermissions = databasePermissions.map(p => ({
            module: p.module,
            sub_module: p.sub_module,
            permissions: p.permissions,
        }));

        // Create roles
        const roles = await Roles.create({
            name: 'Super Admin',
            permissions: superAdminPermissions,
        });
        await Admin.updateOne({ email : "" })

        console.log('✅ Roles and permissions seeded successfully');
    } catch (error) {
        console.error('❌ Error in seeding roles and permissions:', error);
        throw error;
    }
}

export default RolesPermissionsSeeder