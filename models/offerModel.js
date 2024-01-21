const mongoose = require("mongoose");

const { Schema } = mongoose;

const OfferSchema = new Schema({
    categoryName: {
        type:String
    },
    offerPercentage: {
        type:Number,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        default: "Active"
    }
})

const offer = mongoose.model('offer',OfferSchema)
module.exports = offer;