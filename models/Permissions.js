import {model, Schema} from "mongoose";

const PermissionsSchema = new Schema({
    module: {
        type: String,
        required: true,
    },
    sub_module: {
        type: String,
        default: null,
    },
    permissions: {
        type: Array,
        required: true,
    },
});

const Permissions = model("Permissions", PermissionsSchema);

export default Permissions;