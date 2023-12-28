const user = require('../models/userModels')
const { hashData, verifyHashedData } = require('../util/bcryptCompare')
const product = require('../models/productModels')
const banner = require('../models/bannerModels')
const brand = require('../models/brandModels')
const category = require('../models/categoryModels')

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

            const banners = await banner.find()
            const sbanners = await banner.find({ bannerName: "s-banner-1" })
            res.render('user/guestHome', { mensData, womensData, kidsData, banners, sbanners })
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

            const banners = await banner.find()
            const sbanners = await banner.find({ bannerName: "s-banner-1" })
            res.render('user/userHome', { check: req.session.name, login, mensData, womensData, kidsData, banners, sbanners })
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
                console.log("aa");
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
            res.render('user/singleProduct', { data: prdkt[0] })
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
            res.render('user/allProducts', { allPro, count, catgry, allproCount })
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

