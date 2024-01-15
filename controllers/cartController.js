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


            if (cartData != null) {

                //populating product details
                const kart = await cart.findOne({ userId: id._id }).populate("products.productid");

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
            const usr = await user.findOne({ email: req.session.user })
            console.log("usr", usr);
            if (usr) {
                const Cart = await cart.findOne({ userId: usr._id })
                const prdkt = await product.findOne({ _id: req.params.id })

                console.log("stock", prdkt.stockQuantity);

                if (prdkt.stockQuantity != 0) {
                    if (Cart == null) {
                        console.log("cart1");
                        const cartData = {
                            userId: usr._id,
                            products: [
                                {
                                    productid: req.params.id,
                                    quantity: 1
                                }
                            ]
                        }
                        await cart.create(cartData)
                        res.json({ msg: "Product added to cart Successfully" })
                    } else {
                        console.log("cart2");

                        const existPrdkt = await cart.findOne({ userId: usr._id, 'products.productid': req.params.id })

                        if (existPrdkt) {
                            console.log("cart3");
                            await cart.updateOne(
                                {
                                    userId: usr._id, 'products.productid': req.params.id
                                },
                                {
                                    $inc: {
                                        'products.$.quantity': 1
                                    }
                                }
                            )
                            res.json({ msg: "Product quantity updated" })
                        } else {


                            await cart.updateOne(
                                {
                                    userId: usr._id
                                },
                                {
                                    $push:
                                    {
                                        products:
                                        {
                                            productid: req.params.id,
                                            quantity: 1
                                        }
                                    }
                                }
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
                    res.json({ msg: "Product stock limit has reached" })
                } else {
                    await cart.updateOne({ userId: req.session.cartId, 'products.productid': req.params.prodId }, { $inc: { 'products.$.quantity': 1 } })
                    res.json({ msg: "Product Quantity Updated" })
                }


                //to reduce the quantity of products
            } else {
                await cart.updateOne({ userId: req.session.cartId, 'products.productid': req.params.prodId }, { $inc: { 'products.$.quantity': -1 } })

                res.json({ msg: "Product Quantity Updated" })
            }
        } catch (error) {
            console.log(error);
        }
    },

    removeFromCart: async (req, res) => {
        try {
            console.log(req.params.prdktId);
            await cart.updateOne({ userId: req.session.cartId }, { $pull: { products: { productid: req.params.prdktId.trim() } } })
            res.json({ msg: "Product removed from cart successfullly" })
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