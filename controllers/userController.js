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
const mongoose = require('mongoose');
const offer = require('../models/offerModel');

const JWT_SECRET = "jwt-secret-key"

module.exports = {

    //get sign up page
    renderSignup: async (req, res) => {
        try {
            const referId = req.query.refer;

            let usr;
            if (mongoose.Types.ObjectId.isValid(referId)) {
                usr = await user.findOne({ _id: referId });
            }

            if (usr) {
                res.render('user/userSignup', { refer: referId });
            } else {
                res.render('user/userSignup', { refer: '' });
            }
        } catch (error) {
            console.log(error);
        }
    },

    //get guest home page
    renderHome: async (req, res) => {
        try {
            const [prdktsData, bstdl, banners, sbanners, offers] = await Promise.all([
                product.find({ displayStatus: "Show" }).populate('category_id'),
                product.find({ Tags: "bestdeal", displayStatus: "Show" }).populate('category_id'),
                banner.find({ bannerName: /^mainBanner/ }),
                banner.find({ bannerName: /^subBanner/ }),
                offer.find().populate('category_id')
            ])
 

            res.render('user/guestHome', { prdktsData, banners, sbanners, bstdl, check: req.session.name, offers })

        } catch (error) {
            console.log(error);
        }

    },

    //get user home page
    renderUserHome: async (req, res) => {
        try {
            const login = true

            const [prdktsData, bstdl, banners, sbanners, offers] = await Promise.all([
                product.find({ displayStatus: "Show" }).populate('category_id'),
                product.find({ Tags: "bestdeal", displayStatus: "Show" }).populate('category_id'),
                banner.find({ bannerName: /^mainBanner/ }),
                banner.find({ bannerName: /^subBanner/ }),
                offer.find().populate('category_id')
            ])


            res.render('user/userHome', { check: req.session.name, login, prdktsData, banners, sbanners, bstdl, cartCount: req.session.cartCount, offers })

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

            let prdkt = await product.find({ _id: id }).populate('category_id').populate('brand_id')
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

            const [prdkt, crtPdkt] = await Promise.all([
                product.findOne({ _id: id }).populate('category_id').populate('brand_id'),
                cart.findOne({ userId: req.session.name._id, 'products.productid': id })
            ])

            res.render('user/singleProduct', { data: prdkt, check: req.session.name, crtPdkt, cartCount: req.session.cartCount })
        } catch (error) {
            console.log(error);
        }
    },









    // searching products
    searchProduct: async (req, res) => {
        try {
            const searchTerm = req.query.search;

            const [catgry, brnd] = await Promise.all([
                category.findOne({ categoryName: { $regex: searchTerm, $options: "i" } }),
                brand.findOne({ brandName: { $regex: searchTerm, $options: "i" } })
            ])

            const searchOptions = {
                $or: [
                    { productName: { $regex: searchTerm, $options: "i" } },
                    { category_id: catgry },
                    { brand_id: brnd }
                ],
                displayStatus: "Show"
            };

            const searchResults = await product.find(searchOptions).populate('category_id');

            res.render('user/searchProducts', { check: req.session.user, searchResults, searchTerm, cartCount: req.session.cartCount });
        } catch (err) {
            console.error(err.message);

            res.render('errorPage', { errorMessage: 'An error occurred while searching for products.' });
        }
    },




    //all product listing
    allproducts: async (req, res) => {
        try {

            const { categories, brands, minPrice, maxPrice, page = 1, perPage = 9 } = req.query

            const skip = (page - 1) * perPage;

            let allPro
            if (categories == undefined && brands == undefined && maxPrice < 50000) {

                allPro = await product.find({
                    price: { $gte: minPrice, $lte: maxPrice },
                    displayStatus: "Show"
                }).skip(skip).limit(parseInt(perPage)).populate('category_id').populate('brand_id');

            } else if (categories == undefined && brands == undefined) {

                allPro = await product.find({ displayStatus: "Show" }).skip(skip).limit(parseInt(perPage)).populate('category_id').populate('brand_id');

            } else if (categories && brands) {

                allPro = await product.find({
                    category_id: { $in: categories },
                    brand_id: { $in: brands },
                    price: { $gte: minPrice, $lte: maxPrice },
                    displayStatus: "Show"
                }).skip(skip).limit(parseInt(perPage)).populate('category_id').populate('brand_id');

            } else if (categories == undefined && brands) {

                allPro = await product.find({
                    brand_id: { $in: brands },
                    price: { $gte: minPrice, $lte: maxPrice },
                    displayStatus: "Show"
                }).skip(skip).limit(parseInt(perPage)).populate('category_id').populate('brand_id');

            } else if (brands == undefined && categories) {

                allPro = await product.find({
                    category_id: { $in: categories },
                    price: { $gte: minPrice, $lte: maxPrice },
                    displayStatus: "Show"
                }).skip(skip).limit(parseInt(perPage)).populate('category_id').populate('brand_id');

            } else {

                allPro = await product.find({
                    category_id: { $in: categories },
                    brand_id: { $in: brands },
                    price: { $gte: minPrice, $lte: maxPrice },
                    displayStatus: "Show"
                }).skip(skip).limit(parseInt(perPage)).populate('category_id').populate('brand_id');
            }

            const [allproCount, count, catgCount] = await Promise.all([
                product.find().count(),
                product.aggregate([
                    { $group: { _id: "$brand_id", count: { $sum: 1 } } },
                    { $lookup: { from: "brands", localField: "_id", foreignField: "_id", as: "brand" } },
                    { $unwind: "$brand" }]),

                product.aggregate([
                    { $group: { _id: "$category_id", count: { $sum: 1 } } },
                    { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "category" } },
                    { $unwind: "$category" }])
            ])

            const totalPages = Math.ceil(allproCount / perPage);


            res.render('user/allProducts', {
                allPro, count, allproCount, check: req.session.name, catgCount, cartCount: req.session.cartCount,
                totalPages, currentPage: parseInt(page), perPage: parseInt(perPage)
            })

        } catch (error) {
            console.log(error);
        }
    },





    //user profile---------------------------------------

    userProfile: async (req, res) => {
        try {
            const usrData = await user.findOne({ email: req.session.user })

            const successMessage = req.session.successMessage;
            const errorMessage = req.session.errorMessage;
            delete req.session.successMessage;
            delete req.session.errorMessage;

            const [adrs, cupn, refInvt] = await Promise.all([
                address.find({ userId: usrData._id }),
                coupon.find().sort({ _id: -1 }),
                wallet.findOne({ userid: usrData._id }).populate('invited')
            ])

            res.render('user/userProfile', { usrData, adrs, check: req.session.name, cupn, cartCount: req.session.cartCount, refInvt, successMessage, errorMessage })

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
                const link = `https://dropship-ecom.onrender.com/resetpassword/${check._id}/${token}`

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

            const usrEmail = req.session.user
            const { currentpassword: currPass, password: passwrd } = req.body

            const [data, usrData] = await Promise.all([
                user.findOne({ email: usrEmail }),
                user.findOne({ email: req.session.user })
            ])
            const id = usrData._id
            const adrs = await address.find({ userId: id })

            const bcrptPswd = data.password
            const isMatch = await verifyHashedData(currPass, bcrptPswd)

            const cupn = await coupon.find().sort({ _id: -1 })

            if (isMatch) {
                const hashPass = await hashData(passwrd)
                await user.updateOne({ email: usrEmail }, { $set: { password: hashPass } })
                req.session.successMessage = "The password reset successfully";
                res.redirect('/userprofile')
            } else {
                req.session.errorMessage = "The current password entered is incorrect";
                res.redirect('/userprofile')
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

            req.session.name.username = newUsrname
            req.session.successMessage = "Username updated successfully";

            res.redirect('/userprofile')
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
            const [Wallet, waltHstry] = await Promise.all([
                wallet.findOne({ userid: req.session.name._id }),
                walletHistory.findOne({ userid: req.session.name._id })
            ])
            console.log(Wallet);
            console.log(waltHstry);
            res.render('user/myWallet', { check: req.session.name, Wallet, waltHstry, cartCount: req.session.cartCount })
        } catch (error) {
            console.log(error);
        }
    },



    getContactUs: async (req, res) => {
        try {
            res.render('user/contactUs', { check: req.session.name, cartCount: req.session.cartCount })
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

