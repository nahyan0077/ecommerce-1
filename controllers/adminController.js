const user = require('../models/userModels')
const products = require('../models/productModels')
const category = require('../models/categoryModels')
const brand = require('../models/brandModels')


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

    adminProducts : (req,res) =>{
        try {
            res.render('admin/adminProducts')
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

    postAddProducts : (req,res) =>{
        try {
            
        } catch (error) {
            
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
            id = req.params.id
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


    


}