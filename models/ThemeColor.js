import {Schema, model} from "mongoose"

const themeColorSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    primary_color: {
        type: String,
        trim: true,
        required: true,
    },
    secondary_color: {
        type: String,
        trim: true,
        required: true,
    },
    accent_color: {
        type: String,
        trim: true,
        required: true,
    },
    bg_color: {
        type: String,
        trim: true,
        required: true,
    },
    side_color: {
        type: String,
        trim: true,
        required: true,
    },
    fg_color: {
        type: String,
        trim: true,
        required: true,
    },
    active: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
    versionKey: false,
});

export default model("color_theme", themeColorSchema);