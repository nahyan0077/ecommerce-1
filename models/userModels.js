const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        
    },
    email:{
        type:String,
        unique:true,
    },
    mobile:{
        type:String,
    },
    password:{
        type:String,
        
    },
    status:{
        type:String,
        default: "active"
    }
},{
    timestamps:true
});

userSchema.pre('save',async function (next){
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt)
})

const user = mongoose.model('User', userSchema);

//Export the model
module.exports = user