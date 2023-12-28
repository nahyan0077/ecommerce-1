const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var bannerSchema = new mongoose.Schema({
    bannerName : {
        type : String
    },
    bannerImage:{
        type:String,
        required:true,
    },
});

//Export the model
module.exports = mongoose.model('banner', bannerSchema);