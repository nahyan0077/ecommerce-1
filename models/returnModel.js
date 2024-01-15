const mongoose = require("mongoose");


const retutnItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId },
  orderId: { type: mongoose.Schema.Types.ObjectId },
  productId: { type: mongoose.Schema.Types.ObjectId },
  returnReason: {
    type: String,
  },
  description: {
    type: String,
  },
  status : {
    type : String,
    default: "Requested"
  }
});

const returnItem = mongoose.model("returnItem", retutnItemSchema);
module.exports = returnItem;