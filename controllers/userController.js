const user = require('../models/userModels')
const { hashData, verifyHashedData}=require('../util/bcryptCompare')

module.exports = {

    //get sign up page
    renderSignup: (req, res) => {
        try {
            res.render('user/userSignup')
        } catch (error) {
            console.log(error);
        }

    },

    //get guest home page
    renderHome: (req, res) => {
        try {
            res.render('user/guestHome')
        } catch (error) {
            console.log(error);
        }

    },

    //get user home page
    renderUserHome: (req,res) =>{
        try {
            const login = true
            res.render('user/userHome',{check:req.session.name,login})
        } catch (error) {
            console.log(error);
        }
    },

    //get user login page
    userLogin: (req, res) => {
        try {
            res.render('user/userLogin',{errorLogin1:req.session.errorLogin,blockeduser:req.session.blockedUsr})
        } catch (error) {
            console.log(error);
        }
    },

    //post user login details
    userLoginPost: async (req, res) => {
        try {
            const check = await user.findOne({ email: req.body.email });
        
            req.session.name = check
        if(check.status=="active"){    
            if(check!=null){

                const bcrtptPasswd = check.password
                const isMatch = await verifyHashedData(req.body.password,bcrtptPasswd)
        
                if (check.email==req.body.email && isMatch) {
                    req.session.user = req.body.email;
                    req.session.userlogged = true
                    res.redirect('/userhome')
        
                } else {
                    const errorLogin = true
                    req.session.errorLogin = errorLogin
                    res.redirect('/userlogin')
                }
            }else{
                const errorLogin = true
                req.session.errorLogin = errorLogin
                res.redirect('/userlogin')
            }
        }else{
            const blockedUser = true
            req.session.blockedUsr = blockedUser
            res.redirect('/userlogin')
        }

        } catch (error) {
            console.log(error);
        }
    },


    //get empty cart page
    noCart: (req, res) => {
        try {
            res.render('user/nocart')
        } catch (error) {
            console.log(error);
        }

    },





    

    //log out user
    logOut : (req,res)=>{
        req.session.destroy((err)=>{
            if(err){
                console.log(err);
                res.send("logout error")
            }else{
                const logout = true
                res.render('user/guestHome',{logout})
            }
        })
    }


}

