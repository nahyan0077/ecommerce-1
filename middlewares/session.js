const user = require('../models/userModels')

module.exports = {


    //------------------------user

    //after login
    verifyUser : async (req,res,next)=>{
        if(req.session.userlogged){
            const usr = await user.findOne({email:req.session.user})
            //to logOut the blocked user
            if(usr.status=="inactive"){
                req.session.user = false
                res.redirect('/')
            }
            next()
        }else{
            res.redirect('/')
        }
    },

    //before login
    userExist : (req,res,next)=>{
        if(req.session.user){
            res.redirect('/userhome')
        }else{
            next()
        }
    },
    //-------------------------------admin

    //after login
    verifyAdmin : (req,res,next) => {
        if(req.session.adminlogged){
            next()
        }else{
            res.redirect('/adminlogin')
        }
    },

    //before login 
    adminExist : (req,res,next) => {
        if(req.session.admin){
            res.redirect('admindash')
        }else{
            next()
        }
    }
    

}






