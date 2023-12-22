const user = require('../models/userModels')

module.exports = {
    adminLogin : (req,res)=>{
        try {
            res.render('adminLogin')
        } catch (error) {
            console.log(error);
        }
    },
}