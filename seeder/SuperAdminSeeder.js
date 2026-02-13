import Admin from "../models/Admin.js";
import Roles from "../models/Roles.js";

const SuperAdminSeeder = async () => {
    // Check if superadmin already exists
    const existingAdmin = await Admin.findOne({
        email: process.env.SUPERADMIN_EMAIL,
    });

    if (!existingAdmin) {
        const role = await Roles.findOne({name: "Super Admin"});
        await Admin.create({
            name: process.env.SUPERADMIN_NAME,
            email: process.env.SUPERADMIN_EMAIL,
            password: process.env.SUPERADMIN_PASSWORD,
            role: role._id,
        });

        console.log("✅ Superadmin created successfully");
    } else {
        console.log("ℹ️ Superadmin already exists");
    }

}

export default SuperAdminSeeder;