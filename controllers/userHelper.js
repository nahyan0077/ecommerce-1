
const otp = require("../models/otpModels");
const { sendEmail } = require('../auth/nodemailer')
const { generateOTP } = require('../util/generateOtp')
const user = require('../models/userModels')
const wallet = require('../models/walletModel')
const walletHistory = require('../models/walletHistoryModel')



module.exports = {

    //
    userSignupOtp: async (req, res) => {
        try {
            const existinguser = await user.findOne({ email: req.body.email })
            const { username, email, password } = req.body;
            if (existinguser) {
                const userExist = true
                res.render('user/userSignup', { userExist, refer: '' })
                console.log("user exist");
            } else {

                req.session.otpuser = req.body
                console.log("new usr",req.body);

                sendEmail(req.session.otpuser.email)

                res.render('otp')
            }

        } catch (err) {
            console.log(err);
        }
    },


    getSignupOtp: async (req, res) => {
        try {
            res.render('userSignup')
        } catch (err) {
            console.log(err)
        }

    },


    getSignup: (req, res) => {
        console.log("redy")
        try {
            res.render('otp')
        } catch (err) {
            console.log(err);
        }
    },


    postSignup: async (req, res) => {
        console.log("ok mam ", req.body)
        const arr = [];
        const { num1, num2, num3, num4 } = req.body
        arr.push(num1)
        arr.push(num2)
        arr.push(num3)
        arr.push(num4)
        const userotp = arr.join("").toString()

        console.log(userotp)

        const otp_ = await otp.findOne({ email: req.session.otpuser.email })
        console.log(otp_)

        const refer = req.session.otpuser.referredBy

        let referral
        if(refer==""){
            req.session.otpuser.referredBy = null
            referral = req.session.otpuser.referredBy
        }else{
            referral = req.session.otpuser.referredBy
        }

        if (otp_?.otp == userotp && otp_ != null) {

            user.create(req.session.otpuser).then(async(data) => {
                const usr = await user.findOne({email:req.session.otpuser.email})
                await wallet.create({
                    userid:usr._id,
                    wallet:0
                })

                //checking wether referal applied or not
                if(referral!='' && referral!=null){
                    const refWalt = await wallet.findOne({userid:referral})

                    //if applied check if wallet exists for the reffered user
                    if(refWalt){
                        await Promise.all([
                            wallet.updateOne({userid:referral},{$inc:{wallet:100}}),
                            wallet.updateOne({userid:referral},{$push:{invited:usr._id}}),
                            wallet.updateOne({userid:usr._id},{$inc:{wallet:50}})
                        ])

                    }else{
                        await wallet.create({
                            userid:referral,
                            wallet:100,
                            invited:[usr._id]
                        })
                    }

                    const refWalHis = await walletHistory.findOne({userid:referral})
                    if(refWalHis){
                        const amount = 100;
                        const reason = "Bonus for referring an user";
                        const type = "credit";
                        const date = new Date();
                        await walletHistory.updateOne(
                            {userid:referral},
                            {$push:{refund:{amount:amount,reason:reason,type:type,date:date}}},
                            {new:true})
                    }else{
                        const amount = 100;
                        const reason = "Bonus for referring an user";
                        const type = "credit";
                        const date = new Date();
                        await walletHistory.create({
                            userid:referral,
                            refund:[{amount:amount,reason:reason,type:type,date:date}]})
                    }


                    //creating wallet history for user with referal bonus of 50 rupees
                    const usrReason = "SignUp using referral link bonus"
                    await walletHistory.create({
                        userid:usr._id,
                        refund:[{amount:50,reason:usrReason,type:"credit",date:new Date()}]})

                }

                res.render('user/userLogin', { msg: "SignUp Successfully..!" });
            })
        } else {
            res.render('otp', { err: "Incorrect OTP" })
        }

    },


    resendOtp: async (req, res) => {
        sendEmail(req.session.otpuser.email)
        res.render('otp', { status: "OTP resend successfully" })
    },



}