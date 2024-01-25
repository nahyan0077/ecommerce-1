const user = require('../models/userModels')
const products = require('../models/productModels')
const category = require('../models/categoryModels')
const brand = require('../models/brandModels')
const banner = require('../models/bannerModels')
const order = require('../models/orderModels');
const returns = require('../models/returnModel')


module.exports = {



    //--------------------admin login----------------

    adminLogin: (req, res) => {
        try {
            res.render('admin/adminLogin')
        } catch (error) {
            console.log(error);
        }
    },


    adminLoginPost: (req, res) => {

        const adEmail = process.env.adminEmail
        const adPasswd = process.env.adminPassword


        if (adEmail == req.body.email && adPasswd == req.body.password) {
            req.session.adminlogged = true
            req.session.admin = req.body.email
            console.log("add");
            res.redirect('/admindash')
        } else {
            res.render('admin/adminLogin')
        }
    },









    //------------------admin category---------------------



    adminCategory: async (req, res) => {
        try {
            const categ = await category.find()
            const successMessage = req.session.successMessage;
            const errorMessage = req.session.errorMessage;
            delete req.session.successMessage;
            delete req.session.errorMessage;

            res.render('admin/adminCategory', { categ, successMessage, errorMessage })
        } catch (error) {
            console.log(error);
        }
    },



    getAddCategory: (req, res) => {
        try {
            res.render('admin/addCategory', { err: req.session.catExsterr, added: req.session.added })
        } catch (error) {
            console.log(error);
        }
    },


    addCategory: async (req, res) => {
        try {
            let cat = req.body.categoryName
            cat = cat.toUpperCase()
            const existCat = await category.findOne({ categoryName: cat })

            if (existCat) {

                req.session.catExsterr = true
                req.session.added = false
                res.redirect('/addcategorypage')
            } else {
                req.session.added = true
                req.session.catExsterr = false
                await category.create({ categoryName: cat })
                res.redirect('/addcategorypage')
            }
        } catch (error) {
            console.log(error);
        }
    },

    deleteCategory: async (req, res) => {
        try {
            let catId = req.params.id
            await category.deleteOne({ _id: catId })
            res.json({ msg: "Catagory Deleted Successfully" })
        } catch (error) {
            console.log(error);
        }
    },

    editCategory: async (req, res) => {
        try {
            let edtCatId = req.params.id
            let edtCat = await category.findOne({ _id: edtCatId })
            res.render('admin/editCategory', { cat: edtCat })
        } catch (error) {
            console.log(error);
        }
    },

    postEditCategory: async (req, res) => {
        try {
            let id = req.body.id
            let newcat = req.body.categoryName
            newcat = newcat.toUpperCase().trim()

            const exstCat = await category.findOne({ categoryName: newcat })

            if (!exstCat) {
                req.session.successMessage = 'Category editted successfully';
                await category.updateOne({ _id: id }, { $set: { categoryName: newcat } })
                res.redirect('/admincategory')
            } else {
                req.session.errorMessage = 'This Category already exists';
                res.redirect('/admincategory')
            }


        } catch (error) {
            console.log(error);
        }
    },








    //--------------------admin brands-----------------------


    getBrands: async (req, res) => {
        try {
            const brandd = await brand.find()
            const successMessage = req.session.successMessage;
            const errorMessage = req.session.errorMessage;
            delete req.session.successMessage;
            delete req.session.errorMessage;

            res.render('admin/adminBrands', { brandd, successMessage, errorMessage })
        } catch (error) {
            console.log(error);
        }
    },

    getAddBrands: (req, res) => {
        try {
            res.render('admin/addBrands', { err1: req.session.brndExst, added1: req.session.addedBrnd })
        } catch (error) {
            console.log(error);
        }
    },


    addBrands: async (req, res) => {
        try {
            let brnd = req.body.brandName
            brnd = brnd.toUpperCase()
            const existBrnd = await brand.findOne({ brandName: brnd })
            if (existBrnd) {

                req.session.brndExst = true
                req.session.addedBrnd = false
                res.redirect('/addbrandpage')
            } else {
                req.session.addedBrnd = true
                req.session.brndExst = false
                await brand.create({ brandName: brnd })
                res.redirect('/addbrandpage')
            }
        } catch (error) {
            console.log(error);
        }

    },

    editBrand: async (req, res) => {
        try {
            let id = req.params.id
            let editbrnd = await brand.find({ _id: id })
            res.render('admin/editBrands', { brnd: editbrnd[0] })
        } catch (error) {
            console.log(error);
        }
    },

    postEditBrand: async (req, res) => {
        try {
            let id = req.body.id
            let newbrnd = req.body.brandName
            newbrnd = newbrnd.toUpperCase().trim()

            const brndExst = await brand.findOne({ brandName: newbrnd })

            if (!brndExst) {
                req.session.successMessage = 'Brand editted successfully';
                await brand.updateOne({ _id: id }, { $set: { brandName: newbrnd } })
                res.redirect('/adminbrand')
            } else {
                req.session.errorMessage = 'This Brand already exists';
                res.redirect('/adminbrand')
            }



        } catch (error) {
            console.log(error);
        }
    },

    deleteBrands: async (req, res) => {
        try {
            const brndId = req.params.id
            await brand.deleteOne({ _id: brndId })
            res.json({ msg: "Brand Deleted Successfully" })
        } catch (error) {
            console.log(error);
        }
    },






    //----------------admin customers-------------------------





    adminCustomers: async (req, res) => {
        try {
            const customers = await user.find()
            res.render('admin/adminCustomers', { customers })
        } catch (error) {
            console.log(error);
        }
    },

    block_Unbock_User: async (req, res) => {
        try {
            let id = req.params.id
            const blockUser = await user.findOne({ _id: id })
            var msg
            if (blockUser.status == 'active') {
                const blocked = await user.updateOne({ _id: id }, { $set: { status: "inactive" } })
                msg = "User Blocked"
            } else {
                const unblocked = await user.updateOne({ _id: id }, { $set: { status: "active" } })
                msg = "User Unblocked"
            }
            res.json({ msg: `${msg} successfully...!` })
        } catch (error) {
            console.log(error);
        }

    },







    //----------------------admin banner----------------


    //admin banner page render
    getBanner: async (req, res) => {
        try {
            const banners = await banner.find()

            const successMessage = req.session.successMessage;
            const errorMessage = req.session.errorMessage;
            delete req.session.successMessage;
            delete req.session.errorMessage;

            res.render('admin/adminBanner', { banners, successMessage, errorMessage })
        } catch (error) {
            console.log(error);
        }
    },

    getAddBanner: async (req, res) => {
        try {
            res.render('admin/addBanners')
        } catch (error) {
            console.log(error);
        }
    },

    postBanner: async (req, res) => {
        try {
            const imgFiles = req?.files
            const details = req.body


            let bannerImage = imgFiles.banner[0].filename
            const bannerDtls = { ...details, bannerImage }

            const bannerExist = await banner.findOne({ bannerName: req.body.bannerName })

            if (!bannerExist) {

                req.session.successMessage = 'New Banner Added successfully';
                await banner.create(bannerDtls)
                res.redirect('/adminbanner')
            } else {
                await banner.updateOne({ bannerName: req.body.bannerName }, { $set: { bannerImage: bannerImage } })
                req.session.errorMessage = 'Existing Banner is replaced';
                res.redirect('/adminbanner')
            }



        } catch (error) {
            console.log(error);
        }
    },








    //----------------admin orders----------------------



    adminOrders: async (req, res) => {
        try {


            const orders = await order.aggregate([
                { $lookup: { from: 'users', localField: 'userid', foreignField: '_id', as: 'userName' } },
                { $unwind: '$userName' },
                { $sort: { orderDate: -1 } },
                {
                    $project: {
                        username: "$userName.username",
                        'userid': 1,
                        'products': 1,
                        'address': 1,
                        'orderDate': 1,
                        'expectedDeliveryDate': 1,
                        'paymentMethod': 1,
                        'PaymentStatus': 1,
                        'totalAmount': 1,
                        'deliveryDate': 1,
                        'orderStatus': 1,
                        'couponDiscount': 1,
                        'couponCode': 1,
                        'discountAmount': 1
                    }
                }
            ]);



            const retns = await returns.find()

            res.render('admin/adminOrders', { orders, retns })

        } catch (error) {
            console.log(error);
        }
    },


    //list all order details in the admin side
    orderList: async (req, res) => {
        try {
            const odrId = req.params.ids
            const ordrs = await order.findOne({ _id: odrId }).populate("products.productid")

            const retns = await returns.find({ orderId: odrId })

            res.render('admin/orderList', { ordrs, retns })
        } catch (error) {
            console.log(error);
        }
    },

    //update order status by admin

    orderStatus: async (req, res) => {
        try {
            const orderId = req.params.orderid
            const status = req.params.status

            const currentDate = new Date().toLocaleString("en-US", {
                timeZone: "Asia/Kolkata",
            });

            const ordr = await order.findOne({ _id: orderId })


            if (status == "Order Confirmed") {
                await order.updateOne({ _id: orderId.trim() }, { $set: { orderStatus: status.trim() } })
                ordr.products.forEach(async (data, index) => {
                    if (data.status != "Cancelled") {
                        await order.updateOne({ _id: orderId.trim() }, { $set: { [`products.${index}.status`]: "Confirmed" } })
                    }
                });

            } else if (status == "Order Shipped") {
                await order.updateOne({ _id: orderId.trim() }, { $set: { orderStatus: status.trim() } })
                ordr.products.forEach(async (data, index) => {
                    if (data.status != "Cancelled") {
                        await order.updateOne({ _id: orderId.trim() }, { $set: { [`products.${index}.status`]: "Shipped" } })
                    }
                });

            } else if (status == "Order Delivered") {
                await order.updateOne({ _id: orderId.trim() }, { $set: { orderStatus: status.trim(), deliveryDate: currentDate, PaymentStatus: "Paid" } })
                ordr.products.forEach(async (data, index) => {
                    if (data.status != "Cancelled") {
                        await order.updateOne({ _id: orderId.trim() }, { $set: { [`products.${index}.status`]: "Delivered" } })
                    }
                });
            }
            res.json({ msg: "Order status updated" })

        } catch (error) {
            console.log(error);
        }
    },














    //admin logout

    adminLogout: (req, res) => {
        try {
            req.session.destroy((err) => {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('/adminlogin')
                }
            })
        } catch (error) {
            console.log(err);
        }
    }





}