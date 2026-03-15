import {Schema, model} from "mongoose"

const themeCategorySchema = new Schema({
    name :{
        type: String,
        trim: true,
        required: true,
    },
    bg_color: {
        type: String,
        trim: true,
        required: true,
    },
    icon :{
        type: String,
        trim: true,
        required: true,
    },
    gif :{
        type: String,
        trim: true,
        required: true,
    },
    active: {
        type: Boolean,
        default: false,
    }
},{
    timestamps: true,
    versionKey: false,
});

export default model("category_theme", themeCategorySchema);