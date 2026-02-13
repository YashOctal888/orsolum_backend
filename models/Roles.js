import {model, Schema} from "mongoose";

const RoleSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    permissions: [
        {
            type: Object,
        },
    ],
});

const Role = model("Role", RoleSchema);

export default Role;