const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var categorySchema = new mongoose.Schema({
    categoryName:{
        type:String,
    },

});

//Export the model
module.exports = mongoose.model('category', categorySchema);