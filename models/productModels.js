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

    brandName: {
        type: String,
        required: true,
    },

    // size: {
    //     type: Number,
    //     required: true 
    // },

    // tags: {
    //     type: Array,
    // },

    images: {
        type: Array,
        required: true,
    },

    stockQuantity: {
        type: Number,
        required: true,
    },

    category: {
        type: String,
        required: true,
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
    }

    },

    {
        timestamps: true,
    }
);

//Export the model
module.exports = mongoose.model('productDetails', productSchema);