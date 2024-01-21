const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
    {

    productName: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    brand_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'brands',
        required: true,
    },

    images: {
        type: Array,
        required: true,
    },

    stockQuantity: {
        type: Number,
        required: true,
    },

    category_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'category',
    },

    DiscountAmount: {
        type: Number,
    },

    status: {
        type: String,
    },

    Specification1: {
        type: String,
    },

    Specification2: {
        type: String,
    },
    Specification3: {
        type: String,
    },

    Specification4: {
        type: String,
    },
    displayStatus : {
        type: String,
        default :"Show"
    },
    
    Tags : {
        type : String
    },
    inCategoryOffer : {
        type: Boolean,
        default: false
    },
    beforeOffer : {
        type: Number
    }
    },
    {
        timestamps: true,
    }
);

//Export the model
module.exports = mongoose.model('productDetails', productSchema);