const user = require('../models/userModels')
const products = require('../models/productModels')
const category = require('../models/categoryModels')
const brand = require('../models/brandModels')
const banner = require('../models/bannerModels')



module.exports = {
    adminProducts: async (req, res) => {
        try {
            const successMessage = req.session.successMessage;
            const errorMessage = req.session.errorMessage;
            delete req.session.successMessage;
            delete req.session.errorMessage;

            let prdctData = await products.find().populate('brand_id').populate('category_id')
            res.render('admin/adminProducts', { prdctData, successModal: req.session.modal1, successMessage, errorMessage })
        } catch (error) {
            console.log(error);
        }
    },


    adminAddProducts: async (req, res) => {
        try {
            const brnd = await brand.find()
            const cat = await category.find()
            res.render('admin/addProduct', { brnd, cat })
        } catch (error) {
            console.log(error);
        }
    },

    postAddProducts: async (req, res) => {
        try {
            const imgFiles = req?.files
            const prdctDtls = req.body
            let images = [imgFiles.image1[0].filename, imgFiles.image2[0].filename, imgFiles.image3[0].filename, imgFiles.image4[0].filename]
            const prdcts = { ...prdctDtls, images }
            await products.create(prdcts)

            req.session.successMessage = 'New product added successfully';
            res.redirect('/adminproducts')
        } catch (error) {
            req.session.errorMessage = 'Error occured';
            console.log(error);
        }
    },

    showHideProduct: async (req, res) => {
        try {
            const id = req.params.id
            const prdctStatus = await products.findOne({ _id: id })
            var msg
            if (prdctStatus.displayStatus == "Show") {
                await products.updateOne({ _id: id }, { $set: { displayStatus: "Hide" } })
                msg = "Product display status changed to Hidden"
            } else {
                await products.updateOne({ _id: id }, { $set: { displayStatus: "Show" } })
                msg = "Product display status changed to Show"
            }
            res.json({ msg: `${msg} successfully...!` })
        } catch (error) {
            console.log(error);
        }
    },

    deleteProduct: async (req, res) => {
        try {
            let id = req.params.id
            console.log(id);
            await products.deleteOne({ _id: id })
            res.json({ msg: "Product Deleted Successfully" })
        } catch (error) {
            console.log(error);
        }
    },

    editProduct: async (req, res) => {
        try {
            
            let id = req.params.id
            let edtPrdkt = await products.find({ _id: id }).populate('brand_id').populate('category_id')
            const brnd = await brand.find()
            const cat = await category.find()

            res.render('admin/editProducts', { pdktDtls: edtPrdkt[0], brnd, cat })
        } catch (error) {
            console.log(error);
        }
    },


    postEditProducts: async (req, res) => {
        try {
            let id = req.params.id
            let prdktImg = await products.findOne({ _id: id })
            let imgs = []

            if (prdktImg) {
                imgs.push(...prdktImg.images)
            }

            for (let i = 0; i <= 4; i++) {
                if (req.files[i]) {
                    let position = req.files[i].fieldname.split('')
                    imgs[position[5] - 1] = req.files[i].filename
                }
            }

            let updtPrdkts = req.body
            updtPrdkts.images = imgs


            const update = await products.updateOne({ _id: id }, { $set: { ...updtPrdkts } })
            if (update) {
                req.session.successMessage = 'product details updated successfully';
                res.redirect("/adminproducts");
            }else{
                req.session.errorMessage = 'Error occured';
                res.redirect("/adminproducts");
            }

        } catch (error) {
            console.log(error);
        }
    },
}