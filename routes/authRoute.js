const express = require('express');
const router = express.Router()

const userController = require('../controllers/userController')
const middleware = require('../middlewares/session')
const userHelper= require('../controllers/userHelper')


//guestHome page
router.get('/',userController.renderHome)

//user login page
router.get('/userlogin',userController.userLogin)

//user login post
router.post('/userloginPost',userController.userLoginPost)

//user signup page
router.get('/usersignup',userController.renderSignup)

//otp page 
router.post('/signupotp',userHelper.userSignupOtp)

//resent otp
router.get('/resentotp',userHelper.resendOtp)

//check otp and save post data to server
router.post('/signup',userHelper.postSignup)

//empty cart while no user
router.get('/nocart',userController.nocart)



// router.get('/otp',userController.otp)

// router.get('/signup',userHelper.getSignupOtp)










module.exports = router