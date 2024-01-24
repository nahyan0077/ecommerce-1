const mongoose = require('mongoose');

const dbConnect = ()=>{
    try{
        mongoose.connect(process.env.mdb_atlas)
        console.log("Database connected successfully");
    }catch(err){
        console.log("Can't connect to database");
    }
}

module.exports = dbConnect