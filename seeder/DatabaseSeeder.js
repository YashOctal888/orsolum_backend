import 'dotenv/config';
import {dbConnectionStart, dbConnectionEnd} from "../helper/helper.js";
import RolesPermissionsSeeder from './RolePermissionSeeder.js';
import SuperAdminSeeder from "./SuperAdminSeeder.js";

async function databaseSeeder() {
    await dbConnectionStart();

    await RolesPermissionsSeeder();
    await SuperAdminSeeder();

    await dbConnectionEnd();
}

databaseSeeder().then(r => console.log('All seeder run'));