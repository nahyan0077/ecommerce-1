const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
    {
        userId: { 
            type: mongoose.Schema.Types.ObjectId 
        },
        name: {
            type: String
        },
        mobile: {
            type: String
        },
        email: {
            type: String
        },
        address: {
            type: String
        },
        pincode: {
            type: String
        },
        locality: {
            type: String
        },
        city: {
            type: String
        },
        district: {
            type: String
        },
        state: {
            type: String
        },
        addressType: {
            type: String
        }
    }
)

const Address = mongoose.model('address', addressSchema);

module.exports = Address;