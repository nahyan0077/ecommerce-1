const user = require('../models/userModels')
const cart = require('../models/cartModels')
const product = require('../models/productModels')
const address = require('../models/addressModel');
const order = require('../models/orderModels');
const returns = require('../models/returnModel')
const coupon = require('../models/couponModel')
const { createOrder } = require('../controllers/razorpayController')
const crypto = require("crypto");
const wallet = require('../models/walletModel');
const walletHistory = require('../models/walletHistoryModel');
const { log } = require('console');
const { promise } = require('bcrypt/promises');
const { generateInvoice } = require('../util/invoiceCreator')
const fs = require('fs');


module.exports = {

    //render checkout page 

    checkOutPage: async (req, res) => {
        try {
            //for success alert
            const successMessage = req.session.successMessage;
            const errorMessage = req.session.errorMessage;
            delete req.session.successMessage;
            delete req.session.errorMessage;

            const [addrs, carts, orderss, cupnCount, walBalnc] = await Promise.all([
                address.find({ userId: req.session.name._id }),
                cart.findOne({ userId: req.session.name._id }),
                order.findOne({ userId: req.session.name._id }),
                coupon.find().count(),
                wallet.findOne({ userid: req.session.name._id })
            ])

            if (carts) {
                res.render('user/checkoutPage', { grandTotal: req.session.grandTotal, totalDiscount: req.session.totalDiscount, total: req.session.total, addrs, check: req.session.name, cpnMsg: req.session.cpnMsg, cupnDisc: req.session.cpnDiscount, cupnCount, orderss, cartCount: req.session.cartCount, walBalnc , errorMessage , successMessage, addrSlct: req.session.adrsId })
            } else {
                res.redirect('/userhome')
            }

        } catch (error) {
            console.log(error);
        }
    },


    getAddressId: (req, res) => {
        try {
            const addrsId = req.params.adrsid
            console.log("sdf",addrsId);
            req.session.adrsId = addrsId
            res.json({ msg: "Order will be delivered to this address" })

        } catch (error) {
            console.log(error);
        }
    },

    //to confirm and place the order
    confirmOrder: async (req, res) => {
        try {
            const paymntMthd = req.params.type
            const addressId = req.session.adrsId
            const userEmail = req.session.user
            const total = req.session.total
            const totalDiscount = req.session.totalDiscount
            const grandTotal = req.session.grandTotal
            console.log(grandTotal);
            console.log("sdsssss",addressId);

            if (req.session.adrsId == null) {

                res.json({ msg: "please select the address" })

            } else if (paymntMthd == "cashOnDelivery" && req.session.adrsId != null) {

                const usr = await user.findOne({ email: userEmail })

                const [addrs, carts] = await Promise.all([
                    address.findOne({ _id: addressId }),
                    cart.findOne({ userId: usr._id })
                ])

                // date setting------------------------------------------
                const currentDate = new Date().toLocaleString("en-US", {
                    timeZone: "Asia/Kolkata",
                });

                // delivery date ----------------------------------------  
                const deliveryDate = new Date(
                    Date.now() + 4 * 24 * 60 * 60 * 1000
                ).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

                //   if not coupen code ---------------------------------
                let couponCode = "";
                let couponDiscount = 0;

                //   if coupen code--------------------------------------
                if (req.session.cpnDiscount && req.session.couponCode) {
                    couponDiscount = req.session.cpnDiscount;
                    couponCode = req.session.couponCode;
                }

                let myOrders = {
                    userid: usr._id,
                    products: carts.products,
                    address: {
                        name: addrs.name,
                        address: addrs.address,
                        locality: addrs.locality,
                        city: addrs.city,
                        district: addrs.district,
                        state: addrs.state,
                        pincode: addrs.pincode,
                    },
                    orderDate: currentDate,
                    expectedDeliveryDate: deliveryDate,
                    paymentMethod: paymntMthd,
                    PaymentStatus: "Pending",
                    orderStatus: "Order Processed",
                    couponCode: couponCode,
                    couponDiscount: couponDiscount,
                    totalAmount: grandTotal,
                    discountAmount: totalDiscount,
                }

                await order.create(myOrders)

                const prdts = carts.products

                //to update the quantity in inventory

                for (const data of prdts) {

                    try {
                        prdId = data.productid
                        ordrQty = data.quantity

                        const prdt = await product.findOne({ _id: prdId })

                        const stock = prdt.stockQuantity
                        const newStock = stock - ordrQty

                        await product.updateOne({ _id: prdId }, { $set: { stockQuantity: newStock } })


                    } catch (error) {
                        console.log(error);
                    }

                }
                await cart.findByIdAndDelete(carts._id)

                res.json({ payMthd: "COD" })

            } else if (paymntMthd == "onlinePayment" && req.session.adrsId != null) {

                const usr = await user.findOne({ email: userEmail })

                const [addrs, carts] = await Promise.all([
                    await address.findOne({ _id: addressId }),
                    await cart.findOne({ userId: usr._id })
                ])

                // date setting------------------------------------------
                const currentDate = new Date().toLocaleString("en-US", {
                    timeZone: "Asia/Kolkata",
                });

                // delivery date ----------------------------------------  
                const deliveryDate = new Date(
                    Date.now() + 4 * 24 * 60 * 60 * 1000
                ).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });


                //   if not coupen code ---------------------------------
                let couponCode = "";
                let couponDiscount = 0;

                //   if coupen code--------------------------------------
                if (req.session.cpnDiscount && req.session.couponCode) {
                    couponDiscount = req.session.cpnDiscount;
                    couponCode = req.session.couponCode;
                }


                let myOrders = {
                    userid: usr._id,
                    products: carts.products,
                    address: {
                        name: addrs.name,
                        address: addrs.address,
                        locality: addrs.locality,
                        city: addrs.city,
                        district: addrs.district,
                        state: addrs.state,
                        pincode: addrs.pincode,
                    },
                    orderDate: currentDate,
                    expectedDeliveryDate: deliveryDate,
                    paymentMethod: paymntMthd,
                    PaymentStatus: "Pending",
                    orderStatus: "Order Processed",
                    couponCode: couponCode,
                    couponDiscount: couponDiscount,
                    totalAmount: grandTotal,
                    discountAmount: totalDiscount,
                }

                await order.create(myOrders)

                const prdts = carts.products

                //to update the quantity in inventory
                for (const data of prdts) {

                    try {
                        prdId = data.productid
                        ordrQty = data.quantity

                        const prdt = await product.findOne({ _id: prdId })

                        const stock = prdt.stockQuantity
                        const newStock = stock - ordrQty

                        await product.updateOne({ _id: prdId }, { $set: { stockQuantity: newStock } })

                    } catch (error) {
                        console.log(error);
                    }
                }

                const ordrr = await order.findOne().sort({ _id: -1 }).limit(1)

                createOrder(req, res, ordrr._id + "")

                await cart.findByIdAndDelete(carts._id)

            } else if (paymntMthd == "walletPayment" && req.session.adrsId != null) {

            
                const usr = await user.findOne({ email: userEmail })
                const Wallet = await wallet.findOne({ userid: usr._id })
       

                if (Wallet) {
                    

                    

                    if (Wallet.wallet >= grandTotal) {

                        await wallet.updateOne({ userid: usr._id }, { $inc: { wallet: -grandTotal } })

                        const [addrs, carts] = await Promise.all([
                            address.findOne({ _id: addressId }),
                            cart.findOne({ userId: usr._id })
                        ])


                        // date setting------------------------------------------
                        const currentDate = new Date().toLocaleString("en-US", {
                            timeZone: "Asia/Kolkata",
                        });

                        // delivery date ----------------------------------------  
                        const deliveryDate = new Date(
                            Date.now() + 4 * 24 * 60 * 60 * 1000
                        ).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });


                        //   if not coupen code ---------------------------------
                        let couponCode = "";
                        let couponDiscount = 0;

                        //   if coupen code--------------------------------------

                        if (req.session.cpnDiscount && req.session.couponCode) {
                            couponDiscount = req.session.cpnDiscount;
                            couponCode = req.session.couponCode;
                        }

                        let myOrders = {
                            userid: usr._id,
                            products: carts.products,
                            address: {
                                name: addrs.name,
                                address: addrs.address,
                                locality: addrs.locality,
                                city: addrs.city,
                                district: addrs.district,
                                state: addrs.state,
                                pincode: addrs.pincode,
                            },
                            orderDate: currentDate,
                            expectedDeliveryDate: deliveryDate,
                            paymentMethod: paymntMthd,
                            PaymentStatus: "Paid",
                            orderStatus: "Order Processed",
                            couponCode: couponCode,
                            couponDiscount: couponDiscount,
                            totalAmount: grandTotal,
                            discountAmount: totalDiscount,
                        }

                        await order.create(myOrders)

                        const prdts = carts.products

                        //to update the quantity in inventory
                        for (const data of prdts) {

                            try {
                                prdId = data.productid
                                ordrQty = data.quantity

                                const prdt = await product.findOne({ _id: prdId })
                                const stock = prdt.stockQuantity
                                const newStock = stock - ordrQty

                                await product.updateOne({ _id: prdId }, { $set: { stockQuantity: newStock } })

                            } catch (error) {
                                console.log(error);
                            }

                        }

                        const WalHist = await walletHistory.findOne({ userid: usr._id })

                        if (WalHist) {
                            const reason = "Product Purchase With Wallet Amount";
                            const type = "debit";
                            const date = new Date();

                            await walletHistory.updateOne(
                                { userid: usr._id },
                                { $push: {
                                        refund: {
                                            amount: grandTotal,
                                            reason: reason,
                                            type: type,
                                            date: date,
                                        },
                                    },
                                },
                                { new: true }
                            );
                        } else {

                            const reason = "Product Purchase With Wallet Amount";
                            const type = "debit";
                            const date = new Date();
                            await walletHistory.create({
                                userid: usr._id,
                                refund: [
                                    {
                                        amount: grandTotal,
                                        reason: reason,
                                        type: type,
                                        date: date,
                                    },
                                ],
                            });
                        }
                        await cart.findByIdAndDelete(carts._id)
                        res.json({ payMthd: 'wallet' })
                    } else {
                        res.json({ msg: "Insufficient Balance in Wallet" })
                    }
                } else {

                    res.json({ msg: "Wallet doesn't exist" })
                }
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },






    myOrders: async (req, res) => {
        try {
            const usr = await user.findOne({ email: req.session.user })
            const perPage = 6; // Set the number of orders per page
    
            const page = parseInt(req.query.page) || 1;
            const skip = (page - 1) * perPage;
    
            const [orders, orderCount] = await Promise.all([
                order.find({ userid: usr._id }).populate(
                    { path: "products.productid", populate: 
                    { path: 'category_id', model: 'category' } })
                    .sort({ orderDate: -1 }).skip(skip).limit(perPage),
                    
                order.find({ userid: usr._id }).count()
            ]);
    
            const totalPages = Math.ceil(orderCount / perPage);
            
            const paginationData = {
                currentPage: page,
                totalItems: orderCount,
                totalPages: totalPages,
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages,
                prevPage: page - 1,
                nextPage: page + 1
            };
    
            const retns = await returns.find();
    
            res.render('user/myOrders', { orders, check: req.session.name, retns, cartCount: req.session.cartCount, paginationData });
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    



    myOrderDetails: async (req, res) => {
        try {
            const orderId = req.params.orderid
            const [usrOdr, retns] = await Promise.all([
                order.findOne({ _id: orderId }).populate("products.productid"),
                returns.find({ orderId: orderId })
            ])

            res.render('user/myOrderDetails', { usrOdr, check: req.session.name, retns, cartCount: req.session.cartCount })

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },


    cancelOrder: async (req, res) => {
        try {
            const orderId = req.params.orderid

            const ordr = await order.findOne({ _id: orderId })
            ordr.orderStatus = "Cancelled"
            await ordr.save();

            if (ordr.paymentMethod == "onlinePayment" && ordr.PaymentStatus == "Paid" || ordr.paymentMethod == "walletPayment") {
                const walletFind = await wallet.findOne({ userid: ordr.userid })

                if (walletFind) {
                    await wallet.updateOne({ userid: ordr.userid }, { $inc: { wallet: ordr.totalAmount } })
                } else {
                    await wallet.create({
                        userid: ordr.userid,
                        wallet: ordr.totalAmount
                    })
                }
                //wallet history update
                const wallHstry = await walletHistory.findOne({ userid: ordr.userid })
                if (wallHstry) {
                    const amount = ordr.totalAmount;
                    const reason = "Refund of cancelling order";
                    const type = "credit";
                    const date = new Date();
                    await walletHistory.updateOne(
                        { userid: ordr.userid },
                        { $push: { refund: { amount: amount, reason: reason, type: type, date: date } } },
                        { new: true }
                    );
                } else {
                    const amount = ordr.totalAmount;
                    const reason = "Refund of cancelling order";
                    const type = "credit";
                    const date = new Date();
                    await walletHistory.create({
                        userid: ordr.userid,
                        refund: [{ amount: amount, reason: reason, type: type, date: date }],
                    });
                }

                await order.updateOne({_id: orderId},{$set: { PaymentStatus: "Refunded" } })
            }

            await order.updateOne(
                { _id: orderId },
                { $set: { 'products.$[].status': 'Cancelled' } })


            ordr.products.forEach(async data => {
                const prdkt = await product.findOne({ _id: data.productid })
                if (prdkt) {
                    prdkt.stockQuantity = prdkt.stockQuantity + data.quantity
                    await prdkt.save()
                }
            });
            res.json({ msg: "The Order cancelled successfully" })

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },


    // Cancel a single product in an order
    cancelSingleProduct: async (req, res) => {

        try {

            const { prodktid, orderid, index } = req.params;

            const [prdkt, odrDtls] = await Promise.all([
                product.findOne({ _id: prodktid }),
                order.findOne({ _id: orderid })
            ])

            const totalAmnt = prdkt.DiscountAmount * odrDtls.products[index].quantity;

            if (odrDtls.paymentMethod == "onlinePayment" && odrDtls.PaymentStatus == "Paid" || odrDtls.paymentMethod == "walletPayment") {

                const walletFind = await wallet.findOne({ userid: odrDtls.userid })

                if (walletFind) {
                    await wallet.updateOne({ userid: odrDtls.userid }, { $inc: { wallet: totalAmnt } })
                } else {
                    await wallet.create({
                        userid: odrDtls.userid,
                        wallet: totalAmnt
                    })
                }

                //wallet history update
                const wallHstry = await walletHistory.findOne({ userid: odrDtls.userid })
                if (wallHstry) {
                    const amount = totalAmnt;
                    const reason = "Refund of cancelling a product";
                    const type = "credit";
                    const date = new Date();
                    await walletHistory.updateOne(
                        { userid: odrDtls.userid },
                        { $push: { refund: { amount: amount, reason: reason, type: type, date: date } } },
                        { new: true }
                    );
                } else {
                    const amount = totalAmnt;
                    const reason = "Refund of cancelling a product";
                    const type = "credit";
                    const date = new Date();
                    await walletHistory.create({
                        userid: odrDtls.userid,
                        refund: [{ amount: amount, reason: reason, type: type, date: date }]
                    })
                }
            }

            order.updateOne(
                { _id: orderid, 'products._id': odrDtls.products[index]._id },
                { $set: { 'products.$.status': 'Cancelled' }, }
            ).then(async (data) => {

                const odrss = await order.findOne({ _id: orderid })

                const allCancelled = odrss.products.every(data => data.status === "Cancelled");

                // If all products are cancelled, update the order status to 'Cancelled'
                if (allCancelled) {
                    await order.updateOne({ _id: orderid }, { $set: { orderStatus: 'Cancelled', PaymentStatus: 'Refunded' } })
                }
            });

            await product.updateOne({ _id: prodktid }, { $inc: { stockQuantity: odrDtls.products[index].quantity } });

            res.json({ msg: 'This order has been cancelled successfully' });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },



    //return product for the user
    returnProduct: async (req, res) => {
        try {
            console.log(req.body);
            const { returnReason, userId, orderId, productId, description } = req.body
            const returnData = {
                userId: userId,
                orderId: orderId,
                productId: productId,
                returnReason: returnReason,
                description: description,
            }
            await returns.create(returnData)
            await order.updateOne(
                { _id: orderId },
                { $set: { 'products.$[product].status': 'Return Requested' } },
                { arrayFilters: [{ 'product.productid': productId }] }
            );
            res.redirect('/myorders')

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },


    //admin return request response 

    submitReturnResponse: async (req, res) => {
        try {
            console.log(req.body);
            const { prdktId, orderId, userId, status, index } = req.body

            const odrDtls = await order.findById(orderId)
            const prdkt = await product.findById(prdktId)

            var totalAmnt = prdkt.DiscountAmount * odrDtls.products[index].quantity;


            if (status == "Approved") {
                const WalletFind = await wallet.findOne({ userid: userId })

                if (WalletFind) {
                    await wallet.updateOne({ userid: odrDtls.userid }, { $inc: { wallet: totalAmnt } })
                } else {
                    await wallet.create({
                        userid: odrDtls.userid,
                        wallet: totalAmnt
                    })
                }

                //wallet history update

                const wallHstry = await walletHistory.findOne({ userid: odrDtls.userid })
                if (wallHstry) {
                    const amount = totalAmnt;
                    const reason = "Refund of returning order";
                    const type = "credit";
                    const date = new Date();
                    await walletHistory.updateOne(
                        { userid: odrDtls.userid },
                        { $push: { refund: { amount: amount, reason: reason, type: type, date: date } } },
                        { new: true }
                    );
                } else {
                    const amount = totalAmnt;
                    const reason = "Refund of returning order";
                    const type = "credit";
                    const date = new Date();
                    await walletHistory.create({
                        userid: odrDtls.userid,
                        refund: [{ amount: amount, reason: reason, type: type, date: date }],
                    });
                }

                await order.updateOne({ _id: orderId }, { $set: { PaymentStatus: "Refunded" } })
            }

            await returns.updateOne({ userId: userId, orderId: orderId, productId: prdktId }, { $set: { status: status } })

            await order.updateOne(
                { _id: orderId },
                { $set: { 'products.$[product].status': `Return ${status}` } },
                { arrayFilters: [{ 'product.productid': prdktId }] }
            );

            res.json({ msg: `This return has been ${status}` });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },




    //payment succes page after any payment
    paymentSuccessPage: async (req, res) => {
        try {
            const ordr = await order.findOne({ userid: req.session.name._id })
            res.render('user/paymentSuccess', { ordr })
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    },



    //verify the paymnent credentials
    verifyPayment: async (req, res) => {
        try {

            //HMAC (Hash-based Message Authentication Code) using the SHA-256 algorithm

            let hmac = crypto.createHmac("sha256", process.env.RazorPay_key_secret);
            console.log('Request Body:', req.body);
            hmac.update(
                req.body['payment[razorpay_order_id]'] + "|" + req.body['payment[razorpay_payment_id]']
            );

            hmac = hmac.digest("hex");

            if (hmac == req.body['payment[razorpay_signature]']) {

                const orderId = req.body['order[receipt]'];

                await order.updateOne({ _id: orderId }, { $set: { PaymentStatus: "Paid" } });

                res.json({ success: true });

            } else {

                res.json({ failure: true });

            }
        } catch (error) {

            console.log(error);
        }
    },



    generateInvoices: async (req, res) => {
        try {
            const { orderId,index } = req.params

            const orderDetails = await order.findOne({ _id: orderId }).populate('products.productid')
            const deliveredProducts = orderDetails.products.filter(product => product.status === "Delivered");

            if (orderDetails) {

                const invoicePath = await generateInvoice(orderDetails,index,deliveredProducts)
                res.json({ success: true, message: "Invoice generated successfully", invoicePath });

            } else {

                res.status(500).json({ success: false, message: "Invoice generation failed" });
            }

        } catch (error) {

            console.log(error);
            res.status(500).json({ success: false, message: "Error in generating Invoice" });
        }
    },


    downloadInvoice : async (req, res) => {
        try {
            const id = req.params.orderId;
            console.log(id);
            const filePath = `public/invoPdf/${id}.pdf`;

            // if (fs.existsSync(filePath)) {

            //     const fileName = `Invoice_${id}.pdf`;
    
            //     res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            //     res.setHeader('Content-Type', 'application/pdf');
    
            //     const fileStream = fs.createReadStream(filePath);
            //     fileStream.pipe(res);
    
            //     fileStream.on('end', () => {
            //         console.log(`Invoice ${id} downloaded successfully.`);
            //     });
            // } else {
            //     // If the file doesn't exist
            //     res.status(404).json({ success: false, message: "Invoice not found" });
            // }
            res.download(filePath,`invoice_${id}.pdf`)
        } catch (error) {
            console.error("Error in downloading the invoice:", error);
            res.status(500).json({ success: false, message: "Error in downloading the invoice" });
        }
    },
    




}