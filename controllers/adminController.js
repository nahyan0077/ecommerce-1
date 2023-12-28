const user = require('../models/userModels')
const products = require('../models/productModels')
const category = require('../models/categoryModels')
const brand = require('../models/brandModels')
const banner = require('../models/bannerModels')


module.exports = {
    adminLogin : (req,res)=>{
        try {
            res.render('admin/adminLogin')
        } catch (error) {
            console.log(error);
        }
    },


    adminLoginPost : (req,res) => {

        const adEmail = process.env.adminEmail
        const adPasswd = process.env.adminPassword


        if(adEmail == req.body.email && adPasswd == req.body.password){
            req.session.adminlogged = true
            req.session.admin = req.body.email
            console.log("add");
            res.redirect('/admindash')
        }else{
            res.render('admin/adminLogin')
        }
    },





    adminDash : (req,res) =>{
        try {
            res.render('admin/adminDashboard')
        } catch (error) {
            console.log(error);
        }
    },





    adminProducts : async (req,res) =>{
        try {
            let prdctData = await products.find()
            res.render('admin/adminProducts',{prdctData,successModal: req.session.modal1})
        } catch (error) {
            console.log(error);
        }
    },


    adminAddProducts : async (req,res) =>{
        try {
            const brnd = await brand.find()
            const cat = await category.find()
            res.render('admin/addProduct',{brnd,cat})
        } catch (error) {
            console.log(error);
        }
    },

    postAddProducts : async (req,res) =>{
        try {
            const imgFiles = req?.files
            const prdctDtls = req.body
            let images=[imgFiles.image1[0].filename,imgFiles.image2[0].filename,imgFiles.image3[0].filename,imgFiles.image4[0].filename]
            const prdcts = {...prdctDtls,images}
            await products.create(prdcts)
            res.redirect('/adminproducts')
        } catch (error) {
            console.log(error);
        }
    },

    showHideProduct : async (req,res) =>{
        try {
            const id = req.params.id
            const prdctStatus = await products.findOne({_id:id})
            var msg 
            if(prdctStatus.displayStatus=="Show"){
                await products.updateOne({_id:id},{$set:{displayStatus:"Hide"}})
                msg = "Product display status changed to Hidden"
            }else{
                await products.updateOne({_id:id},{$set:{displayStatus:"Show"}})
                msg = "Product display status changed to Show"
            }
            res.json({msg:`${msg} successfully...!`})
        } catch (error) {
            console.log(error);
        }
    },

    deleteProduct : async (req,res) => {
        try {
            let id = req.params.id
            console.log(id);
            await products.deleteOne({_id:id})
            res.json({msg:"Product Deleted Successfully"})
        } catch (error) {
            console.log(error);
        }
    },

    editProduct : async (req,res) => {
        try {
            let id = req.params.id
            let edtPrdkt = await products.find({_id:id})
            const brnd = await brand.find()
            const cat = await category.find()
            console.log(edtPrdkt);
            res.render('admin/editProducts',{pdktDtls:edtPrdkt[0],brnd,cat})
        } catch (error) {
            console.log(error);
        }
    },

    postEditProducts : async (req,res) => {
        try {
            let id = req.params.id
            let prdktImg = await products.find({_id:id})
            let imgs
            if(prdktImg){
                imgs = [...prdktImg[0].images]
            }
            console.log(req?.files);

            for(let i = 0; i <= 4; i++){
                if(req?.files[i]){
                    console.log("okkkk")
                   let position = req.files[i].fieldname.split('')
                   imgs[position[5]-1] = req.files[i].filename
                }
            }

            let updtPrdkts = req.body
            updtPrdkts.images = imgs



            const update = await products.updateOne({_id:id},{$set:{...updtPrdkts}})
            if (update) {
                res.redirect("/adminproducts");
            }

        } catch (error) {
            console.log(error);
        }
    },










    adminCategory : async (req,res) =>{
        try {
            const categ = await category.find()
            
            res.render('admin/adminCategory',{categ})
        } catch (error) {
            console.log(error);
        }
    },



    getAddCategory : (req,res) => {
        try {
            res.render('admin/addCategory',{err:req.session.catExsterr,added:req.session.added})   
        } catch (error) {
            console.log(error);
        }
    },


    addCategory : async (req,res) =>{
        try {
            let cat = req.body.categoryName
            cat = cat.toUpperCase()
            const existCat = await category.findOne({categoryName:cat}) 
            
            if(existCat){

                req.session.catExsterr = true
                req.session.added = false
                res.redirect('/addcategorypage') 
            }else{
                req.session.added = true
                req.session.catExsterr = false
                await category.create({categoryName:cat})
                res.redirect('/addcategorypage')
            }
        } catch (error) {
            console.log(error);
        }
    },

    deleteCategory : async (req,res) => {
        try {
            let catId = req.params.id
            await category.deleteOne({_id:catId})
            res.json({msg:"Catagory Deleted Successfully"})
        } catch (error) {
            console.log(error);
        }
    },

    editCategory : async (req,res) =>{
        try {
            let edtCatId = req.params.id
            let edtCat = await category.find({_id:edtCatId})
            res.render('admin/editCategory',{cat:edtCat[0]}) 
        } catch (error) {
            console.log(error);
        }
    },

    postEditCategory : async (req,res) => {
        try {
            let id = req.body.id
            let newcat = req.body.categoryName
            newcat = newcat.toUpperCase().trim()
            await category.updateOne({_id:id},{$set:{categoryName:newcat}})
            res.redirect('/admincategory')
        } catch (error) {
            console.log(error);
        }
    },







    getBrands : async (req,res) => {
        try {
            const brandd = await brand.find() 
            res.render('admin/adminBrands',{brandd})
        } catch (error) {
            console.log(error);
        }
    },

    getAddBrands : (req,res) =>{
        try {
            res.render('admin/addBrands',{err1:req.session.brndExst,added1:req.session.addedBrnd})
        } catch (error) {
            console.log(error);
        }
    },


    addBrands : async (req,res) =>{
        try {
            let brnd = req.body.brandName
            brnd = brnd.toUpperCase()
            const existBrnd = await brand.findOne({brandName:brnd}) 
            if(existBrnd){

                req.session.brndExst = true
                req.session.addedBrnd = false
                res.redirect('/addbrandpage') 
            }else{
                req.session.addedBrnd = true
                req.session.brndExst = false
                await brand.create({brandName:brnd})
                res.redirect('/addbrandpage')
            }
        } catch (error) {
            console.log(error);
        }
        
    },

    editBrand : async (req,res) => {
        try {
            let id = req.params.id
            let editbrnd = await brand.find({_id:id}) 
            res.render('admin/editBrands',{brnd:editbrnd[0]})
        } catch (error) {
            console.log(error);
        }
    },

    postEditBrand : async (req,res) => {
        try {
            let id = req.body.id
            let newbrnd = req.body.brandName
            newbrnd = newbrnd.toUpperCase().trim()
            console.log(newbrnd);
            await brand.updateOne({_id:id},{$set:{brandName:newbrnd}})
            res.redirect('/adminbrand')
            
        } catch (error) {
            console.log(error);
        }
    },

    deleteBrands : async (req,res) => {
        try {
            const brndId = req.params.id
            await brand.deleteOne({_id:brndId})
            res.json({msg:"Brand Deleted Successfully"})
        } catch (error) {
            console.log(error);
        }
    },










    adminCustomers : async (req,res) =>{
        try {
            const customers = await user.find()
            res.render('admin/adminCustomers',{customers})
        } catch (error) {
            console.log(error);
        }
    },
    
    block_Unbock_User : async (req,res) => {
        try {
            let id = req.params.id
            const blockUser = await user.findOne({_id:id})
            var msg
            if(blockUser.status == 'active'){
                const blocked = await user.updateOne({_id:id},{$set:{status : "inactive"}})
                msg = "User Blocked"
            }else{
                const unblocked = await user.updateOne({_id:id},{$set:{status : "active"}})
                msg = "User Unblocked"
            }
            res.json({msg:`${msg} successfully...!`})
        } catch (error) {
            console.log(error);
        }

    },




    //admin banner page render
    getBanner : async (req,res) => {
        try {
            const banners = await banner.find()
            res.render('admin/adminBanner',{banners})
        } catch (error) {
            console.log(error);
        }
    },

    getAddBanner : async (req,res) => {
        try {
            res.render('admin/addBanners')
        } catch (error) {
            console.log(error);
        }
    },

    postBanner : async (req,res) => {
        try {
            const imgFiles = req?.files
            const details = req.body
            // let images=[imgFiles.image1[0].filename,imgFiles.image2[0].filename,imgFiles.image3[0].filename,imgFiles.image4[0].filename]
            let bannerImage = imgFiles.banner[0].filename
            const bannerDtls = {...details,bannerImage}
            await banner.create(bannerDtls)
            res.redirect('/adminbanner')
        } catch (error) {
            console.log(error);
        }
    },










    //admin logout

    adminLogout : (req,res)=>{
        try {
            req.session.destroy((err)=>{
                if(err){
                    console.log(err);
                }else{
                    res.redirect('/adminlogin')
                }
            })
        } catch (error) {
            console.log(err);
        }
    }


    


}