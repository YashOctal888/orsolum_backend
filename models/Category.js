import {Schema, model} from "mongoose";

const CategorySchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    },
    category_name: {
        type: String,
        required: true
    },
    sub_category_name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["online", "local"],
        default: "online"
    }
}, {
    timestamps: true
})

export default model("Category", CategorySchema);