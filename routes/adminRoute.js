const express = require('express');
const router = express.Router()

const adminController = require('../controllers/adminController')
const middleware = require('../middlewares/session')

router.get('/adminlogin',adminController.adminLogin)
router.post('/adminloginpost',adminController.adminLoginPost)
router.get('/admindash',adminController.adminDash)
router.get('/adminproducts',adminController.adminProducts)
router.get('/admincategory',adminController.adminCategory)
router.get('/addproducts',adminController.adminAddProducts)
router.get('/admincustomers',adminController.adminCustomers)
router.get('/blockuser/:id',adminController.block_Unbock_User)
router.get('/addcategorypage',adminController.getAddCategory)
router.post('/addcategory',adminController.addCategory)
router.get('/adminbrand',adminController.getBrands)
router.get('/addbrandpage',adminController.getAddBrands)
router.post('/addbrand',adminController.addBrands)




module.exports = router