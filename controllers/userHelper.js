const User= require("../models/userModels");
const otp = require("../models/otpModels");
const {sendEmail}=require('../auth/nodemailer')
const { generateOTP}=require('../util/generateOtp')
const user = require('../models/userModels')


var _email;
var _name;
var _status;
var _password;
var _otp;
module.exports={

    userSignupOtp : async (req,res)=>{
        try{
            const existinguser = await user.findOne({email : req.body.email})
            const { email, password} = req.body;
            if(existinguser){
                const userExist = true
                res.render('userSignup',{userExist})
                console.log("user exist");
            }else{

                req.session.otpuser = req.body
 
                _email=email
                _password=password

                sendEmail(email)
     
                res.render('otp')
            }
            
        }catch(err){
            console.log(err);
        }
    },

    
    getSignupOtp:async(req,res)=>{
        try{
            res.render('userSignup')
        }catch(err){
            console.log(err)
        }

    },


    getSignup:(req,res)=>{
        console.log("redy")
        try{
            
            res.render('otp')

        }catch(err){
            console.log(err);
        }
    },


    postSignup:async (req,res)=>{
        console.log("ok mam ",req.body)
        const arr=[];
        const {num1,num2,num3,num4}=req.body
        arr.push(num1)
        arr.push(num2)
        arr.push(num3)
        arr.push(num4)
        const userotp=arr.join("").toString()
        console.log(_otp)
        console.log(userotp)

        const otp_=await otp.findOne({email:req.session.otpuser.email})
        console.log(otp_)
        if(otp_?.otp==userotp&&otp_!=null){
            User.create(req.session.otpuser).then((data)=>{
                res.render('userLogin',{msg:"SignUp Successfully..!"});
            })
        }else{
            res.render('otp',{err:"Incorrect OTP"})
        }
       
    },


    resendOtp:async (req,res)=>{
           sendEmail(req.session.otpuser.email)
           res.render('otp',{status:"OTP resend successfully" })
    },


    postLogin:async(req,res)=>{
       const {email,password}=req.body
      const data= await User.findOne({email:email})
      console.log(data)
     if(data&&data.status=='active'&&data.password===password){

        console.log(data.name)
        res.redirect('/userhome')
     }else{
        res.render("user/login",{err:"Incorrect password or email"})
     }
    }

}