import { Schema, model } from "mongoose"

const PromotionPosterSchema = new Schema({
    poster :{
        type : String,
        required : true,
    },
    category_id :{
        type : Schema.Types.ObjectId,
        required : true,
    },
    subcategory_id :{
        type : Schema.Types.ObjectId,
    },
    button_text : {
        type : String,
        required : true,
    },
    button_text_color :{
        type : String,
        default : "#FFFFFF"
    },
    button_bg_color : {
        type : String,
        default : "#000000"
    },
    button_position : {
        type : String,
        default : "bottom",
    }
},{
    timestamps: true,
    versionKey: false,
});

export default model("promotion_poster", PromotionPosterSchema);