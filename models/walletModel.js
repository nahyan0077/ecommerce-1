const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const walletSchema = new Schema({
  userid: { type: Schema.Types.ObjectId },
  wallet: {
    type: Number,
  },
  invited: Array,
});

const wallet = mongoose.model("wallet", walletSchema);
module.exports = wallet;