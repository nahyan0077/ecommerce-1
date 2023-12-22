const user = require('../models/userModels')

module.exports = {


    renderSignup : (req,res)=>{
        try {
            res.render('userSignup')
        } catch (error) {
            console.log(error);
        }
        
    },


    renderHome : (req,res)=>{
        try {
            res.render('guestHome')
        } catch (error) {
            console.log(error);
        }
        
    },



    userLogin : (req,res)=>{
        try {
            res.render('userLogin')
        } catch (error) {
            console.log(error);
        }
    },



    userLoginPost : async (req,res)=>{
        const check = await user.findOne({ email: req.body.email });
        req.session.user = req.body.email;
        
        if(check.email === req.body.email ){
            res.render('userHome',{check})
        }else{
            res.redirect('/userlogin')
        }
    },



    nocart : (req,res)=>{
        try {
            res.render('nocart')
        } catch (error) {
            console.log(error);
        }
        
    },

    
}

