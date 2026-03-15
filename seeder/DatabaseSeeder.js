import 'dotenv/config';
import {dbConnectionStart, dbConnectionEnd} from "../helper/helper.js";
import RolesPermissionsSeeder from './RolePermissionSeeder.js';
import SuperAdminSeeder from "./SuperAdminSeeder.js";
import ThemeColorSeeder from "./ThemeColorSeeder.js";

// Registry of available seeders
const seeders = {
    rolePermission: RolesPermissionsSeeder,
    admin: SuperAdminSeeder,
    themeColor: ThemeColorSeeder
};

async function databaseSeeder() {
    await dbConnectionStart();

    const specificSeeder = process.argv[2];

    try {
        if (specificSeeder) {
            if (seeders[specificSeeder]) {
                console.log(`\x1b[36m%s\x1b[0m`, `--- Running Specific Seeder: ${specificSeeder} ---`);
                await seeders[specificSeeder]();
            } else {
                console.error(`\x1b[31m%s\x1b[0m`, `Error: Seeder "${specificSeeder}" not found.`);
                console.log(`Available seeders: ${Object.keys(seeders).join(', ')}`);
                process.exit(1);
            }
        } else {
            console.log(`\x1b[33m%s\x1b[0m`, `--- Running All Seeders ---`);
            for (const name in seeders) {
                console.log(`Executing: ${name}...`);
                await seeders[name]();
            }
        }

        console.log(`\x1b[32m%s\x1b[0m`, '✔ Database seeding completed successfully.');
    } catch (error) {
        console.error(`\x1b[31m%s\x1b[0m`, '✖ Seeding failed:', error.message);
        process.exit(1);
    } finally {
        await dbConnectionEnd();
    }
}

databaseSeeder();