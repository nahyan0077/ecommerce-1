const express = require('express');
const router = express.Router()

const adminController = require('../controllers/adminController')
const middleware = require('../middlewares/session')
const multerUpload = require('../middlewares/multer');
const upload = require('../middlewares/multer');
const productController = require('../controllers/productsController');
const orderController = require('../controllers/orderController');
const couponController = require('../controllers/couponController')


//------------------------admin login controls-----------------------

//admin login page render
router.get('/adminlogin',middleware.adminExist,adminController.adminLogin)

//admin login post 
router.post('/adminloginpost',adminController.adminLoginPost)




//-------------Dasshboard-----------------------


//admin dashboard page render
router.get('/admindash',middleware.verifyAdmin,adminController.adminDash)








//-------------Customer-----------------------


//admin customers page render
router.get('/admincustomers',middleware.verifyAdmin,adminController.adminCustomers)

//admin block and unblock customers
router.get('/blockuser/:id',middleware.verifyAdmin,adminController.block_Unbock_User)








//-------------Category-----------------------


//admin category page render
router.get('/admincategory',middleware.verifyAdmin,adminController.adminCategory)

//admin addCategory page render
router.get('/addcategorypage',middleware.verifyAdmin,adminController.getAddCategory)

//admin adding categories
router.post('/addcategory',adminController.addCategory)

//admin delete catagories
router.get('/deletecategory/:id',middleware.verifyAdmin,adminController.deleteCategory)

//admin edit catagories page
router.get('/editcategory/:id',adminController.editCategory)

//admin update catagories
router.post('/updatecategory',adminController.postEditCategory)









//-------------Brands-----------------------



//admin brand page render
router.get('/adminbrand',middleware.verifyAdmin,adminController.getBrands)

//admin addBrand page render
router.get('/addbrandpage',middleware.verifyAdmin,adminController.getAddBrands)

//admin adding brands
router.post('/addbrand',adminController.addBrands)


//admin delete brands
router.get('/deletebrand/:id',adminController.deleteBrands)


//admin edit brands
router.get('/editbrand/:id',adminController.editBrand)

//admin update brands
router.post('/updatebrand',adminController.postEditBrand)

//return request response from admin
router.post('/submitreturnresponse',orderController.submitReturnResponse)












//-------------Products-----------------------

const uploadFields = [
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ];


//admin products page render
router.get('/adminproducts',middleware.verifyAdmin,productController.adminProducts)

//admin add products page render
router.get('/addproductspage',middleware.verifyAdmin,productController.adminAddProducts)

//admin post products details
router.post('/addproducts',multerUpload.fields(uploadFields),productController.postAddProducts) 

//show or hide product for the list of products
router.get('/showorhide/:id',productController.showHideProduct)

//delete product 
router.get('/deleteproduct/:id',productController.deleteProduct)

//edit product details page
router.get('/editproducts/:id',productController.editProduct)

//update product
router.post('/updateproducts/:id',multerUpload.any(),productController.postEditProducts)








//-----------------orders----------------

//get admin orders
router.get('/adminorders',middleware.verifyAdmin,adminController.adminOrders)

//list orders
router.get('/orderlist1/:ids/:idk',adminController.orderList)

//update order status by admin
router.get('/updateorderstatus/:orderid/:status',adminController.orderStatus)








//---------------banner----------------

const uploadBanner = [
  {name:"banner",maxCount : 1}
]

//admin banner page render
router.get('/adminbanner',middleware.verifyAdmin,adminController.getBanner)

//add banner page render
router.get('/addbannerpage',middleware.verifyAdmin,adminController.getAddBanner)

//add banner post 
router.post('/addbanner',multerUpload.fields(uploadBanner),adminController.postBanner)




//-------------------admin coupon------------------

//render coupon page 
router.get('/admincoupon',middleware.verifyAdmin,couponController.getCoupon)

//add coupon admin
router.post('/addcoupon',middleware.verifyAdmin,couponController.addCoupon)

//delete coupon 
router.delete('/deletecoupon/:cupnId',couponController.deleteCoupon)

//get edit coupon 
router.get('/editcoupon/:id',couponController.getEditCoupon)

//post edit coupon
router.post('/posteditcoupon/:id',couponController.postEditCoupon)









//admin logout
router.get('/adminlogout',adminController.adminLogout)


module.exports = router