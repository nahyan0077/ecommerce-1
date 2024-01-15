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
const coupon = require('../models/couponModel')
const wallet = require('../models/walletModel')
const walletHistory = require('../models/walletHistoryModel')

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
            const [mensData, womensData, kidsData, bstdl] = await Promise.all([
                await product.find({ category: "MENS", displayStatus: "Show" }),
                await product.find({ category: "WOMENS", displayStatus: "Show" }),
                await product.find({ category: "KIDS", displayStatus: "Show" }),
                await product.find({ Tags: "bestdeal", displayStatus: "Show" })
            ])

            const banners = await banner.find()
            const sbanners = await banner.find({ bannerName: "s-banner-1" })
            res.render('user/guestHome', { mensData, womensData, kidsData, banners, sbanners, bstdl, check: req.session.name })
        } catch (error) {
            console.log(error);
        }

    },

    //get user home page
    renderUserHome: async (req, res) => {
        try {
            const login = true

            const [mensData, womensData, kidsData, bstdl] = await Promise.all([
                await product.find({ category: "MENS", displayStatus: "Show" }),
                await product.find({ category: "WOMENS", displayStatus: "Show" }),
                await product.find({ category: "KIDS", displayStatus: "Show" }),
                await product.find({ Tags: "bestdeal", displayStatus: "Show" })
            ])

            const banners = await banner.find()
            const sbanners = await banner.find({ bannerName: "s-banner-1" })

            // const carts = await cart.findOne({ userId: req.session.name._id })
            // if (carts != null) {
            //     var cartCount = 0
            //     carts.products.forEach(data => {
            //         cartCount++
            //     })
            //     req.session.cartCount = cartCount
            // } else {
            //     req.session.cartCount = '0'
            // }


            res.render('user/userHome', { check: req.session.name, login, mensData, womensData, kidsData, banners, sbanners, bstdl, cartCount: req.session.cartCount })
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
                        res.render('user/userLogin', { errorLogin1 })
                    }
                } else {

                    const blockeduser = true
                    res.render('user/userLogin', { blockeduser })
                }
            } else {

                const errorLogin1 = true
                res.render('user/userLogin', { errorLogin1 })
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


    //when no user exist 
    singleProductNoUser: async (req, res) => {
        try {
            let id = req.params.id

            let prdkt = await product.find({ _id: id })
            const crtPdkt = null

            res.render('user/singleProduct', { data: prdkt[0], crtPdkt, check: req.session.name, cartCount: req.session.cartCount })


        } catch (error) {
            console.log(error);
        }
    },

    //user exists
    singleProduct: async (req, res) => {
        try {
            let id = req.params.id

            let prdkt = await product.findOne({ _id: id })

            const crtPdkt = await cart.findOne({ userId: req.session.name._id, 'products.productid': id })

            console.log("prst", crtPdkt);

            res.render('user/singleProduct', { data: prdkt, check: req.session.name, crtPdkt, cartCount: req.session.cartCount })
        } catch (error) {
            console.log(error);
        }
    },









    // searching products
    searchProduct: async (req, res) => {
        try {
            const searchTerm = req.query.search; // Extract search term from query parameters
            const searchOptions = {
                $or: [
                    { productName: { $regex: searchTerm, $options: "i" } },
                    { category: { $regex: searchTerm, $options: "i" } },
                    { brandName: { $regex: searchTerm, $options: "i" } }
                ],
                displayStatus: "Show"
            };

            const searchResults = await product.find(searchOptions);

            res.render('user/searchProducts', { check: req.session.user, searchResults, searchTerm, cartCount: req.session.cartCount });
        } catch (err) {
            console.error(err.message);
            // Handle errors appropriately
            res.render('errorPage', { errorMessage: 'An error occurred while searching for products.' });
        }
    },




    //all product listing
    allproducts: async (req, res) => {
        try {

            console.log("acc", req.body);
            console.log("acasdac", req.body.categories);
            console.log("acasdac", req.body.minPrice);

            const { categories, brands, minPrice, maxPrice } = req.body

            let allPro
            if (categories == undefined && brands == undefined && maxPrice<50000) {
                console.log("full");
                
                console.log("prcc");
                allPro = await product.find({
                    price: { $gte: minPrice, $lte: maxPrice },
                    displayStatus: "Show"
                });
            } else if (categories == undefined && brands == undefined ) {
                console.log("prcc");
                allPro = await product.find({ displayStatus: "Show" })
            } else if (categories && brands) {
                console.log("c");
                allPro = await product.find({
                    category: { $in: categories },
                    brandName: { $in: brands },
                    price: { $gte: minPrice, $lte: maxPrice },
                    displayStatus: "Show"
                });
            } else if (categories == undefined && brands) {
                console.log("d");
                allPro = await product.find({
                    brandName: { $in: brands },
                    price: { $gte: minPrice, $lte: maxPrice },
                    displayStatus: "Show"
                });
            } else if (brands == undefined && categories) {
                console.log("e");
                allPro = await product.find({
                    category: { $in: categories },
                    price: { $gte: minPrice, $lte: maxPrice },
                    displayStatus: "Show"
                });

            } else {
                console.log("noo onee");

                allPro = await product.find({
                    category: { $in: categories },
                    brandName: { $in: brands },
                    price: { $gte: minPrice, $lte: maxPrice },
                    displayStatus: "Show"
                });
            }



            const allproCount = await product.find().count()
            const count = await product.aggregate([{ $group: { _id: "$brandName", count: { $sum: 1 } } }])
            const catgCount = await product.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }])


            res.render('user/allProducts', { allPro, count, allproCount, check: req.session.name, catgCount, cartCount: req.session.cartCount })

        } catch (error) {
            console.log(error);
        }
    },





    //user profile---------------------------------------

    userProfile: async (req, res) => {
        try {
            const usrData = await user.findOne({ email: req.session.user })
            const id = usrData._id
            const adrs = await address.find({ userId: id })
            const cupn = await coupon.find().sort({ _id: -1 })


            res.render('user/userProfile', { usrData, adrs, check: req.session.name, cupn, cartCount: req.session.cartCount })

        } catch (error) {
            console.log(error);
        }
    },


    //forgot password-------------------------------


    //verify user email
    verifyEmail: async (req, res) => {
        try {
            res.render('user/verifyEmail')
        } catch (error) {
            console.log(error);
        }
    },




    //verify the email and send password reset mail to the user email
    postVerfyEmail: async (req, res) => {
        try {
            const _email = req.body.email
            const check = await user.findOne({ email: _email })
            console.log(_email);
            console.log(check);
            if (check != null) {

                const secret = JWT_SECRET + check.password
                const payload = {
                    email: check.email,
                    id: check._id
                }
                const token = jwt.sign(payload, secret, { expiresIn: '5m' })
                const link = `http://localhost:3000/resetpassword/${check._id}/${token}`

                console.log(link);

                sendResetEmail(check.email, link)
                const msg = "Password reset link has been sent to your Email"
                res.render('user/verifyEmail', { msg })

            } else {
                let msg = "This Email not exist please SignUp"
                res.render('user/verifyEmail', { msg })
            }
        } catch (error) {
            console.log(error);
        }
    },


    //render reset password page after sending the link to email
    resetPassword: async (req, res) => {
        try {
            const { id, token } = req.params
            const userId = await user.findOne({ _id: id })
            console.log(id);
            console.log(token);
            if (userId == null) {
                const msg = "invalid link"
                res.render('user/verifyEmail', { msg })
            } else {
                const secret = JWT_SECRET + userId.password
                try {
                    req.session.resetEmail = userId.email
                    const payload = jwt.verify(token, secret)
                    res.render('user/resetPassword')
                } catch (error) {
                    console.log(error);
                    const msg = "Email reset link has been expired"
                    res.render('user/verifyEmail', { msg })
                }
            }
        } catch (error) {
            console.log(error);
        }
    },

    
    //reset the password and redirect to userlogin page
    postResetPassword: async (req, res) => {
        try {
            const paswd = req.body.password

            console.log(paswd);
            const hashPass = await hashData(paswd)

            await user.updateOne({ email: req.session.resetEmail }, { $set: { password: hashPass } })
            const msg = "The new password updated"
            res.render('user/userLogin', { msg })
        } catch (error) {
            console.log(error);
        }
    },



    //reset password user profile--------------------------

    profileResetPassword: async (req, res) => {
        try {
            const currPass = req.body.currentpassword
            const passwrd = req.body.password
            const usrEmail = req.session.user

            const data = await user.findOne({ email: usrEmail })

            const usrData = await user.findOne({ email: req.session.user })
            const id = usrData._id
            const adrs = await address.find({ userId: id })

            const bcrptPswd = data.password
            const isMatch = await verifyHashedData(currPass, bcrptPswd)
            console.log(data);
            console.log(isMatch);
            const cupn = await coupon.find().sort({ _id: -1 })

            if (isMatch) {
                const hashPass = await hashData(passwrd)
                await user.updateOne({ email: usrEmail }, { $set: { password: hashPass } })
                const msg = "The password reset successfully"
                res.render('user/userProfile', { msg, usrData, adrs, check: req.session.name, cupn, cartCount: req.session.cartCount })
            } else {
                const msg = "The current password entered is incorrect"
                res.render('user/userProfile', { msg, usrData, adrs, check: req.session.name, cupn, cartCount: req.session.cartCount })
            }

        } catch (error) {
            console.log(error);
        }
    },


    //edit user name
    postEditUsername: async (req, res) => {
        try {
            const newUsrname = req.body.username
            await user.updateOne({ email: req.session.user }, { $set: { username: newUsrname } })
            const msg = "The username updated successfully"
            const usrData = await user.findOne({ email: req.session.user })
            const id = usrData._id
            const adrs = await address.find({ userId: id })
            const cupn = await coupon.find().sort({ _id: -1 })



            res.render('user/userProfile', { msg, usrData, adrs: req.session.address, adrs, cupn })
        } catch (error) {
            console.log(error);
        }
    },


    //delete address
    deleteAddress: async (req, res) => {
        try {
            let id = req.params.id
            console.log(id);
            await address.deleteOne({ _id: id })
            res.json({ msg: "Address Deleted Successfully" })
        } catch (error) {
            console.log(error);
        }
    },



    //user wallet 
    getWallet: async (req, res) => {
        try {
            const Wallet = await wallet.findOne({ userid: req.session.name._id })
            const waltHstry = await walletHistory.findOne({ userid: req.session.name._id })
            console.log(Wallet);
            console.log(waltHstry);
            res.render('user/myWallet', { check: req.session.name, Wallet, waltHstry, cartCount: req.session.cartCount })
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

