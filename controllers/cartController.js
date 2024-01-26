const user = require('../models/userModels')
const cart = require('../models/cartModels')
const product = require('../models/productModels')
const address = require('../models/addressModel');


module.exports = {

    //get the cart page 
    getCart: async (req, res) => {
        try {
            const id = req.session.name

            const cartData = await cart.findOne({ userId: id._id })
            req.session.cartId = id._id

            if (cartData != null && cartData.products.length != 0) {

                //populating product details
                const kart = await cart.findOne({ userId: id._id }).populate(
                    { path: "products.productid", populate: { path: 'category_id', model: 'category' } });

                const carts = kart.products

                let total = 0;
                let grandTotal = 0;


                carts.forEach(item => {
                    //discount amount sum
                    grandTotal = grandTotal + item.quantity * item.productid.DiscountAmount

                    //real price sum
                    total = total + item.quantity * item.productid.price
                })

                //realPrice - discount price 
                let totalDiscount = total - grandTotal

                //adding to session for checkout page
                req.session.total = total
                req.session.totalDiscount = totalDiscount
                req.session.grandTotal = grandTotal
                req.session.couponCode = ""
                req.session.cpnDiscount = 0
                req.session.cpnMsg = ""
                req.session.adrsId = null


                res.render('user/cart', { carts, grandTotal, totalDiscount, total, check: req.session.name, kart, cartCount: req.session.cartCount })

            } else {

                res.render('user/emptyCart', { check: req.session.name, cartCount: req.session.cartCount })
            }


        } catch (error) {
            console.log(error);
        }
    },


    //add a product to cart
    addToCart: async (req, res) => {
        try {
            const {id, discPrice} = req.params
            const usr = await user.findOne({ email: req.session.user })

            if (usr) {
                const [Cart, prdkt] = await Promise.all([
                    cart.findOne({ userId: usr._id }),
                    product.findOne({ _id: id })
                ])

                if (prdkt.stockQuantity != 0) {
                    if (Cart == null) {

                        const cartData = {
                            userId: usr._id,
                            products: [{ productid: req.params.id, quantity: 1, price: discPrice }]
                        }
                        await cart.create(cartData)

                        res.json({ msg: "Product added to cart Successfully" })
                    } else {

                        const existPrdkt = await cart.findOne({ userId: usr._id, 'products.productid': req.params.id })

                        if (existPrdkt) {

                            await cart.updateOne(
                                { userId: usr._id, 'products.productid': req.params.id },
                                { $inc: { 'products.$.quantity': 1 } }
                            )

                            res.json({ msg: "Product quantity updated" })

                        } else {


                            await cart.updateOne(
                                { userId: usr._id },
                                { $push: { products: { productid: req.params.id, quantity: 1, price: discPrice } } }
                            )

                            res.json({ msg: "New product added" })
                        }
                    }
                } else {
                    res.json({ msg: "This product is out of stock" })
                }
            } else {
                res.json({ msg: "No user found" })
            }

        } catch (error) {
            console.log(error);
        }
    },

    updateQuantity: async (req, res) => {
        try {
            console.log(req.params);

            const prdkt = await product.findOne({ _id: req.params.prodId })


            //to add prduct quantity
            if (req.params.count == 1) {
                if (prdkt.stockQuantity == req.params.qty) {
                    res.json({ success : false, msg: "Product stock limit has reached" })
                } else {
                    await cart.updateOne({ userId: req.session.cartId, 'products.productid': req.params.prodId }, { $inc: { 'products.$.quantity': 1 } })
                    const kart = await cart.findOne({ userId: req.session.cartId }).populate(
                        { path: "products.productid", populate: { path: 'category_id', model: 'category' } });
    
                    const carts = kart.products
    
                    let total = 0;
                    let grandTotal = 0;
    
    
                    carts.forEach(item => {
                        //discount amount sum
                        grandTotal = grandTotal + item.quantity * item.productid.DiscountAmount
    
                        //real price sum
                        total = total + item.quantity * item.productid.price
                        prdktQty = item.productid.stockQuantity
                    })
                    let totalDiscount = total - grandTotal
                    
                    res.json({ success : true, grandTotal, total, quantity:req.params.qty, count:req.params.count, totalDiscount, prdktQty })
                }

                if(req.params.qty >= 5){
                    await cart.updateOne({ userId: req.session.cartId, 'products.productid': req.params.prodId }, { $set: { 'products.$.quantity': 5 } })
                    res.json({ success : false, msg: "Product Quantity limit exceeded" })
                }


            //to reduce the quantity of products
            } else {
                await cart.updateOne({ userId: req.session.cartId, 'products.productid': req.params.prodId }, { $inc: { 'products.$.quantity': -1 } })
                const kart = await cart.findOne({ userId: req.session.cartId }).populate(
                    { path: "products.productid", populate: { path: 'category_id', model: 'category' } });

                const carts = kart.products

                let total = 0;
                let grandTotal = 0;


                carts.forEach(item => {
                    //discount amount sum
                    grandTotal = grandTotal + item.quantity * item.productid.DiscountAmount

                    //real price sum
                    total = total + item.quantity * item.productid.price
                    prdktQty = item.productid.stockQuantity
                })
                let totalDiscount = total - grandTotal
                res.json({ success : true, grandTotal, total, quantity:req.params.qty, count:req.params.count, totalDiscount, prdktQty })


                if(req.params.qty <= 0){
                    await cart.updateOne({ userId: req.session.cartId, 'products.productid': req.params.count }, { $set: { 'products.$.quantity': 1 } })
                    res.json({ success : false, msg: "Product Quantity can't be less than zero " })
                }

            }
        } catch (error) {
            console.log(error);
        }
    },

    removeFromCart: async (req, res) => {
        try {
            console.log(req.params.prdktId);
            await cart.updateOne({ userId: req.session.cartId }, { $pull: { products: { productid: req.params.prdktId.trim() } } })
            res.json({ msg: "Product removed from cart successfully" })
        } catch (error) {
            console.log(error);
        }
    },

    clearCart: async (req, res) => {
        try {
            console.log(req.params);

            await cart.deleteOne({ _id: req.params.prdkid })
            res.json({ msg: "Cart cleared" })

        } catch (error) {
            console.log(error);
        }
    },




}