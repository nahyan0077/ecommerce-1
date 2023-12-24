const express = require('express');
const router = express.Router()

const userController = require('../controllers/userController')
const middleware = require('../middlewares/session')
const userHelper= require('../controllers/userHelper')


//guestHome page
router.get('/',middleware.userExist,userController.renderHome)

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

//empty cart while no user
router.get('/nocart',userController.noCart)

//user exist home page 
router.get('/userhome',middleware.verifyUser,userController.renderUserHome)









//user log out
router.get('/logout',userController.logOut)


module.exports = router