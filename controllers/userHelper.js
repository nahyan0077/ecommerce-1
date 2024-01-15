
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
                res.render('user/userSignup', { userExist })
                console.log("user exist");
            } else {

                req.session.otpuser = req.body

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
        if (otp_?.otp == userotp && otp_ != null) {

            user.create(req.session.otpuser).then(async(data) => {
                const usr = await user.findOne({email:req.session.otpuser.email})
                await wallet.create({
                    userid:usr._id,
                    wallet:0
                })
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