const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var brandSchema = new mongoose.Schema({
    brandName:{
        type:String,
    },

});

//Export the model
module.exports = mongoose.model('brands', brandSchema);