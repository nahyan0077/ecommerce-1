const product = require('../models/productModels')
const user = require('../models/userModels')
const wishlist = require('../models/wishlistModel')
const cart = require('../models/cartModels')




module.exports = {
    getWishlist : async (req,res) => {
        try {

            const [wish, carts] = await Promise.all([
                wishlist.findOne(
                    {userid:req.session.name._id}).populate(
                        {path: "products.productid",  populate: [
                            {path: 'category_id', model: 'category'}, { path: 'brand_id', model: 'brands' } ]}),

                cart.findOne({ userId: req.session.name._id }).populate("products.productid")
            ])


            let prdktCheck = [];
            if(wish!=null){
                if (carts && carts.products) {
                    prdktCheck = wish.products.map(wishlistProduct => {
                        wishlistProduct.inCart = carts.products.some(cartProduct => cartProduct.productid._id.equals(wishlistProduct.productid._id));
                        return wishlistProduct.inCart;
                    });
                } else {
                    prdktCheck = Array(wish.products.length).fill(false);
                }
  
                res.render('user/wishlist',{check: req.session.name,wish,prdktCheck,cartCount:req.session.cartCount})
            }else{
                res.render('user/wishlist',{check: req.session.name,wish,prdktCheck,cartCount:req.session.cartCount})
            }
        } catch (error) {
            console.log(error);
        }
    },
    

    addToWishlist : async (req,res) => {
        try {
            console.log(req.params)
            const usr = await user.findOne({email:req.session.user})
            if(usr){
                const wishlst = await wishlist.findOne({userid:usr._id})
                if(wishlst){

                    wishlist.findOne({userid:usr._id,'products.productid':req.params.prdktId}).then(async (data)=>{
                        if(data){
                            res.json({prdktExist:true,userr:true})
                        }else{
                            await wishlist.updateOne({userid:usr._id},{$push:{products:{productid:req.params.prdktId}}})
                            res.json({prdktExist:false,userr:true})
                        }
                    })
                }else{
                    const wishData = {
                        userid : usr._id,
                        products : [ { productid : req.params.prdktId }]
                    }
                    await wishlist.create(wishData)
                    res.json({prdktExist:false,userr:true})
                }
            }else{
                res.json({userr:false})
            }
        } catch (error) {
            console.log(error);
        }
    },

    removeFromWishlist : async (req,res) => {
        try {
            console.log(req.params);
            const {prdktid,wishId} = req.params

            await wishlist.updateOne({_id:wishId},{$pull:{products:{productid:prdktid.trim()}}})
            res.json({msg:"Product removed from wishlist successfully"})
        } catch (error) {
            console.log(error);
        }
    },

    noWishlist : (req,res) => {
        try {
            res.render('user/noWishlist')
        } catch (error) {
            console.log(error);
        }
    }

}