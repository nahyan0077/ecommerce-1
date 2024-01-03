const user = require('../models/userModels')
const { hashData, verifyHashedData } = require('../util/bcryptCompare')
const product = require('../models/productModels')
const banner = require('../models/bannerModels')
const brand = require('../models/brandModels')
const category = require('../models/categoryModels')
const { sendResetEmail } = require('../auth/nodemailRestPass')
const otp = require("../models/otpModels");
const jwt = require('jsonwebtoken')
const address = require('../models/addressModel')
const cart = require('../models/cartModels')

const JWT_SECRET = "jwt-secret-key"

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
    renderHome: async (req, res) => {
        try {
            let mensData = await product.find({ category: "MENS", displayStatus: "Show" })
            let womensData = await product.find({ category: "WOMENS", displayStatus: "Show" })
            let kidsData = await product.find({ category: "KIDS", displayStatus: "Show" })
            let bstdl = await product.find({Tags:"bestdeal",displayStatus: "Show"})

            const banners = await banner.find()
            const sbanners = await banner.find({ bannerName: "s-banner-1" })
            res.render('user/guestHome', { mensData, womensData, kidsData, banners, sbanners ,bstdl })
        } catch (error) {
            console.log(error);
        }

    },

    //get user home page
    renderUserHome: async (req, res) => {
        try {
            const login = true
            let mensData = await product.find({ category: "MENS", displayStatus: "Show" })
            let womensData = await product.find({ category: "WOMENS", displayStatus: "Show" })
            let kidsData = await product.find({ category: "KIDS", displayStatus: "Show" })
            let bstdl = await product.find({Tags:"bestdeal",displayStatus: "Show"})

            const banners = await banner.find()
            const sbanners = await banner.find({ bannerName: "s-banner-1" })

            res.render('user/userHome', { check: req.session.name, login, mensData, womensData, kidsData, banners, sbanners ,bstdl})
        } catch (error) {
            console.log(error);
        }
    },

    //get user login page
    userLogin: (req, res) => {
        try {
            res.render('user/userLogin', { errorLogin1: req.session.errorLogin, blockeduser: req.session.blockedUsr })
        } catch (error) {
            console.log(error);
        }
    },



    //post user login details
    userLoginPost: async (req, res) => {
        try {
            const check = await user.findOne({ email: req.body.email });

            //to display name in userhome
            req.session.name = check
            
            if (check != null) {

                if (check.status == "active") {

                    const bcrtptPasswd = check.password
                    const isMatch = await verifyHashedData(req.body.password, bcrtptPasswd)

                    if (check.email == req.body.email && isMatch) {

                        req.session.user = req.body.email;
                        req.session.userlogged = true
                        res.redirect('/userhome')

                    } else {

                        const errorLogin1 = true
                        res.render('user/userLogin', { errorLogin1})
                    }
                } else {
                    
                    const blockeduser = true
                    res.render('user/userLogin', { blockeduser })
                }
            } else {
                
                const errorLogin1 = true
                res.render('user/userLogin', { errorLogin1})
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



    singleProduct: async (req, res) => {
        try {
            let id = req.params.id
            let prdkt = await product.find({ _id: id })

            const crtPdkt = await cart.findOne({userId:req.session.name._id,'products.productid':id})

            console.log("prst",crtPdkt);

            res.render('user/singleProduct', { data: prdkt[0] , check: req.session.name,crtPdkt})
        } catch (error) {
            console.log(error);
        }
    },








    //searching products
    searchProduct: async (req, res) => {
        try {
            console.log(req.body)
            const prdct = await product.find({
                productName: { $regex: "^" + req.body.search, $options: "i" }, status: "Active"
            })
            res.render('user/allProducts', { prdct })
        } catch (err) {
            console.log(err);
        }
    },


    //all product listing
    allproducts: async (req, res) => {
        try {
            const allPro = await product.find()
            const allproCount = await product.find().count()
            console.log(allproCount);
            const count = await product.aggregate([{ $group: { _id: "$brandName", count: { $sum: 1 } } }])
            const catgry = await category.find()
            res.render('user/allProducts', { allPro, count, catgry, allproCount ,check: req.session.name})
        } catch (error) {
            console.log(error);
        }
    },





    //user profile---------------------------------------

    userProfile : async (req,res) => {
        try {
            const usrData = await user.findOne({email:req.session.user})
            const id = usrData._id
            const adrs = await address.find({userId:id})


            res.render('user/userProfile',{usrData,adrs,check:req.session.name})
        } catch (error) {
            console.log(error);
        }
    },


    //forgot password-------------------------------


    //verify user email
    verifyEmail : async (req,res) => {
        try {
            res.render('user/verifyEmail')
        } catch (error) {
            console.log(error);
        }
    },

    
    //forget Password-----------------------------------------------------
    
    //verify the email and send password reset mail to the user email
    postVerfyEmail : async (req,res) => {
        try {
            const _email = req.body.email
            const check = await user.findOne({email:_email})
            console.log(_email);
            console.log(check);
            if(check!=null){

                const secret = JWT_SECRET + check.password
                const payload = {
                    email : check.email,
                    id : check._id
                }
                const token = jwt.sign(payload, secret, {expiresIn: '5m'})
                const link = `http://localhost:3000/resetpassword/${check._id}/${token}`

                console.log(link);

                sendResetEmail(check.email,link)
                const msg = "Password reset link has been sent to your Email"
                res.render('user/verifyEmail',{msg})

            }else{
                let msg = "This Email not exist please SignUp"
                res.render('user/verifyEmail',{msg})
            }
        } catch (error) {
            console.log(error);
        }
    },


    //render reset password page after sending the link to email
    resetPassword : async (req,res) => {
        try {
            const {id,token} = req.params
            const userId = await user.findOne({_id:id})
            console.log(id);
            console.log(token);
            if(userId==null){
                const msg = "invalid link"
                res.render('user/verifyEmail',{msg})
            }else{
                const secret = JWT_SECRET + userId.password
                try {
                    req.session.resetEmail = userId.email
                    const payload = jwt.verify(token,secret)
                    res.render('user/resetPassword')
                } catch (error) {
                    console.log(error);
                    const msg = "Email reset link has been expired"
                    res.render('user/verifyEmail',{msg})
                }
            }
        } catch (error) {
            console.log(error);      
        }
    },

    //reset the password and redirect to userlogin page
    postResetPassword : async (req,res) => {
        try {
            const paswd = req.body.password

            console.log(paswd);
            const hashPass = await hashData(paswd)

            await user.updateOne({email:req.session.resetEmail},{$set:{password:hashPass}})
            const msg = "The new password updated"
            res.render('user/userLogin',{msg})
        } catch (error) {
            console.log(error);
        }
    },



    //reset password user profile--------------------------

    profileResetPassword : async (req,res) => {
        try {
            const currPass = req.body.currentpassword
            const passwrd = req.body.password
            const usrEmail = req.session.user
            
            const data = await user.findOne({email:usrEmail})

            const usrData = await user.findOne({email:req.session.user})
            const id = usrData._id
            const adrs = await address.find({userId:id})

            const bcrptPswd = data.password
            const isMatch = await verifyHashedData(currPass, bcrptPswd)
            console.log(data);
            console.log(isMatch);

            if(isMatch){
                const hashPass = await hashData(passwrd)
                await user.updateOne({email:usrEmail},{$set:{password:hashPass}})
                const msg = "The password reset successfully"
                res.render('user/userProfile',{msg,usrData,adrs})
            }else{
                const msg = "The current password entered is incorrect"
                res.render('user/userProfile',{msg,usrData,adrs})
            }

        } catch (error) {
            console.log(error);
        }
    },


    //edit user name
    postEditUsername : async (req,res) => {
        try {
            const newUsrname = req.body.username
            await user.updateOne({email:req.session.user},{$set:{username:newUsrname}})
            const msg = "The username updated successfully"
            const usrData = await user.findOne({email:req.session.user})
            const id = usrData._id
            const adrs = await address.find({userId:id})



            res.render('user/userProfile',{msg,usrData,adrs:req.session.address,adrs})
        } catch (error) {
            console.log(error);
        }
    },


    //delete address
    deleteAddress : async (req,res) => {
        try {
            let id = req.params.id
            console.log(id);
            await address.deleteOne({_id:id})
            res.json({msg:"Address Deleted Successfully"})
        } catch (error) {
            console.log(error);
        }
    },






    //log out user
    logOut: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
                res.send("logout error")
            } else {
                const logout = true
                res.redirect('/')
            }
        })
    }


}

