const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wishlistSchema = new Schema({
  userid: {
    type: Schema.Types.ObjectId,
  },
   products: [{
    productid: {
      type: Schema.Types.ObjectId,ref : 'productDetails'
    },
  }],
});

const wishlist = mongoose.model("wishlist", wishlistSchema);
module.exports = wishlist;