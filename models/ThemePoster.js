import {Schema, model} from "mongoose"

const themePosterSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    poster : {
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

export default model("poster_theme", themePosterSchema);