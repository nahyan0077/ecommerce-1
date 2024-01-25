const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId
        },
        products:[
            {
                productid:{type: mongoose.Schema.Types.ObjectId, ref: "productDetails"},
                quantity: { type: Number },
                price: { type: Number }
            }
        ]
    }
);

//Export the model
module.exports = mongoose.model('cart', cartSchema);