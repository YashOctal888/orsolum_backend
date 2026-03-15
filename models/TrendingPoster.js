import { Schema, model } from "mongoose"

const TrendingPosterSchema = new Schema({
    category_id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    subcategory_id: {
        type: Schema.Types.ObjectId,
    },
    bg_color: {
        type: String,
        trim: true,
        required: true,
    },
    poster: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
    versionKey: false,
})

export default model("trending_poster", TrendingPosterSchema)