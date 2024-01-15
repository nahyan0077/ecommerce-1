const user = require('../models/userModels')
const cart = require('../models/cartModels')

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

            //update the cart count navbar
            const carts = await cart.findOne({ userId: req.session.name._id })

            if (carts != null) {
                var cartCount = 0
                carts.products.forEach(data => {
                    cartCount++
                })
                req.session.cartCount = cartCount
            } else {
                req.session.cartCount = '0'
            }
            next()
        }else{
            res.redirect('/')
        }
    },

    //before login
    userExist : (req,res,next)=>{
        if(req.session.user){
            res.locals.cartCount = req.session.cartCount
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






