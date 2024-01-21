const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const walletSchema = new Schema({
  userid: { type: Schema.Types.ObjectId },
  wallet: {
    type: Number,
  },
  invited: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

const wallet = mongoose.model("wallet", walletSchema);
module.exports = wallet;