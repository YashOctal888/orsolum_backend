import {Schema, model} from "mongoose"

const FeaturedCampaignSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    text_color: {
        type: String,
        default: "#FFFFFF",
        trim: true,
    },
    text_bg_color: {
        type: String,
        default: "#FFFFFF",
    },
    text_position: {
        type: String,
        default: "top"
    },
    banner: {
        type: String,
        trim: true
    },
    category_id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    subcategory_id: {
        type: Schema.Types.ObjectId,
    },
})

export default model("featured_campaign", FeaturedCampaignSchema)