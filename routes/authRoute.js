const express = require('express');
const router = express.Router()

const userController = require('../controllers/userController')
const middleware = require('../middlewares/session')
const userHelper= require('../controllers/userHelper')
const addressController = require('../controllers/addressController')
const cartController = require('../controllers/cartController')
const orderController = require('../controllers/orderController')
const couponController = require('../controllers/couponController');
const order = require('../models/orderModels');
const wishlistController = require('../controllers/wishlistController')






//-----------------------------------Home page-------------------------

//guestHome page
router.get('/',middleware.userExist,userController.renderHome)

//user exist home page 
router.get('/userhome',middleware.verifyUser,userController.renderUserHome)








//-----------------------SignUp Management-------------------------------

//user login page
router.get('/userlogin',middleware.userExist,userController.userLogin)

//user login post
router.post('/userloginPost',userController.userLoginPost)

//user signup page
router.get('/usersignup',middleware.userExist,userController.renderSignup)

//otp page 
router.post('/signupotp',userHelper.userSignupOtp)

//resent otp
router.get('/resentotp',userHelper.resendOtp)

//check otp and save post data to server
router.post('/signup',userHelper.postSignup)






//-----------------product showing--------------------------


//user single product page render
router.get('/singleproductnouser/:id',userController.singleProductNoUser)


//user single product page render
router.get('/singleproduct/:id',userController.singleProduct)


//search product
router.get('/search',userController.searchProduct)

//all products
router.get('/allproducts',userController.allproducts)


//user profile
router.get('/userprofile',middleware.verifyUser,userController.userProfile)






//--------------------------forgot password----------

//verfy email
router.get('/verifyemail',userController.verifyEmail)

//post verify email
router.post('/postverifyemail',userController.postVerfyEmail)

//reset password page
router.get('/resetpassword/:id/:token',userController.resetPassword)

//post reset password and confirm password
router.post('/postresetpassword',userController.postResetPassword)








//--------------------------------user profile reset password

router.post('/profileresetpassword',userController.profileResetPassword)


//reset username in user profile
router.post('/resetusername',userController.postEditUsername)

//userProfile add address
router.post('/postaddaddress',addressController.PostAddAddress)

//checkout page add address------------
router.post('/postaddaddress-checkout',addressController.PostAddAddressCheckout)

//userProfile edit address
router.post('/posteditaddress',addressController.postEditAddress)

//delete address
router.delete('/deleteaddress/:id',addressController.deleteAddress)







//---------------------------------cart Mangement----------

//empty cart while no user
router.get('/nocart',middleware.userExist,userController.noCart)

//get cart
router.get('/usercart',middleware.verifyUser,cartController.getCart)

//add to cart 
router.put('/addtocart/:id/:discPrice',cartController.addToCart)

//update quantity in cart
router.patch('/updatequantity/:count/:prodId/:qty/:usrId',cartController.updateQuantity)

//remove a product form cart
router.delete('/removecart/:prdktId',cartController.removeFromCart)

//clear all products in the cart
router.delete('/clearcart/:prdkid',cartController.clearCart)

//rendring checkout page
router.get('/checkout',middleware.verifyUser,orderController.checkOutPage)

//get shipping address
router.get('/selectaddress/:adrsid',orderController.getAddressId)







//-------------user orders------------------------------


//confirm order 
router.get('/confirmorder/:type',orderController.confirmOrder)

//myOrders page
router.get('/myorders',middleware.verifyUser,orderController.myOrders)

//myOrderDetails
router.get('/myorderdetails/:orderid',middleware.verifyUser,orderController.myOrderDetails)

//cancel order
router.patch('/cancelorder/:orderid',orderController.cancelOrder)

//cancel a single product form an order
router.patch('/cancelsingleproduct/:prodktid/:orderid/:index',orderController.cancelSingleProduct)

//return single product 
router.post('/returnrequest',orderController.returnProduct)

//payment success page for user side
router.get('/paymentsuccesspage',middleware.verifyUser,orderController.paymentSuccessPage)

//verify payment
router.post('/verifypayment',middleware.verifyUser,orderController.verifyPayment)



//--------------------------coupons-------------------------

//get available coupons
router.get('/usercoupons',middleware.verifyUser,couponController.userCoupons)

//apply the coupon
router.post('/applycoupon',couponController.applyCoupon)





//--------------apply filter--------------------

router.get('/applyfilter',userController.allproducts)




//---------------------wishlist-----------
router.get('/wishlist',middleware.verifyUser,wishlistController.getWishlist)

//add to wishlist 
router.get('/addtowishlist/:prdktId',wishlistController.addToWishlist)

//remove from wishlist 
router.delete('/removefromwishlist/:prdktid/:wishId',wishlistController.removeFromWishlist)

//no wishlist
router.get('/nowishlist',wishlistController.noWishlist)


//usr wallet
router.get('/userwallet',middleware.verifyUser,userController.getWallet)



//------------------order invoice genrate-------------

router.get('/generateinvoice/:orderId/:index',orderController.generateInvoices)


router.get('/downloadinvoice/:orderId',orderController.downloadInvoice)




//------------------------contact us page----------------------

router.get('/contactus',userController.getContactUs)






//user log out
router.get('/logout',userController.logOut)


module.exports = router