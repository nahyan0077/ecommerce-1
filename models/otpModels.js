const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
        },

        otp: {
            type: String,
        }
      },
      {
        timestamps: true,
      }
)

const otpSignin = mongoose.model("otp", otpSchema);
module.exports = otpSignin;

