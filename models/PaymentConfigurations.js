import {model, Schema} from "mongoose"

const PaymentConfigurationsSchema = new Schema({
    type: {
        type: String,
        default: "global",
        unique: true,
    },
    platform_fee: {
        type: Number,
        required: true,
        default: 0,
    },
    delivery_charges: {
        type: Number,
        required: true,
        default: 0,
    },
    gst_percentage: {
        type: Number,
        required: true,
        default: 0,
    },
}, {timestamps: true})

const PaymentConfigurationsModel = model('payment_configuration', PaymentConfigurationsSchema)

export default PaymentConfigurationsModel;