const mongoose = require("mongoose");
const { Schema } = mongoose;

const couponSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
  },
  couponCode: String,
  description: String,
  minPurchaseAmount: Number,
  discountAmount: Number,
  validFrom : Date,
  validTo: Date,
  
});

const coupon = mongoose.model("coupon", couponSchema);
module.exports = coupon;