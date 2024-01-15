const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//brand schema
const walletHistorySchema = new Schema({
  userid: {
    type: Schema.Types.ObjectId,
  },
  refund: [
    {
      amount: { type: Number },
      reason: { type: String },
      type: { type: String },
      date: { type: Date },
    },
  ],
});

const WalletHistory = mongoose.model("walletHistory", walletHistorySchema);
module.exports = WalletHistory;