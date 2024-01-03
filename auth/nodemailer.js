const nodemailer = require('nodemailer')
const { generateOTP } = require('../util/generateOtp')
const otp = require('../models/otpModels')



async function sendEmail(recipientEmail) {

    // otp generations ---------------------
    await otp.deleteOne({ email: recipientEmail })
    let OTP = generateOTP();
    console.log(" your otp is :" + OTP)

    await otp.create({ email: recipientEmail, otp: OTP })
    setTimeout(async () => {
        await otp.deleteOne({ email: recipientEmail })
    }, 120000)


    // Create a nodemailer transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail', // e.g., 'gmail'
        auth: {
            user: process.env.email,
            pass: process.env.pass
        }
    });
    transporter.verify((err, success) => {
        if (err) {
            console.log(err)
        } else {
            console.log("mail is ok ")
        }
    })
    // Define email options
    let mailOptions = {
        from: process.env.email_,
        to: recipientEmail,
        subject: 'DropShip e-commerce pvt ltd ',
        text: `Your Sign Up OTP code is:${OTP}` // Fix: Use backticks for template literals
    };


    // Send email
    let info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${recipientEmail}: ${info.messageId}`);
}

module.exports = { sendEmail }