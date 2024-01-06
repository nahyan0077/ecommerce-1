const user = require('../models/userModels')
const cart = require('../models/cartModels')
const product = require('../models/productModels')
const address = require('../models/addressModel');
const order = require('../models/orderModels');


module.exports = {

        //render checkout page 
    
        checkOutPage : async (req,res) => {
            try {
                const addrs = await address.find({userId:req.session.name._id})
                const carts = await cart.findOne({userId:req.session.name._id})
                if(carts){
                    res.render('user/checkoutPage',{grandTotal:req.session.grandTotal,totalDiscount:req.session.totalDiscount,total:req.session.total,addrs,check: req.session.name})
                }else{
                    res.redirect('/userhome')
                }
                
            } catch (error) {
                console.log(error);
            }
        },


        getAddressId : (req,res) => {
            try {
                const addrsId = req.params.adrsid
                console.log(addrsId);
                req.session.adrsId = addrsId
                res.json({msg:"Order will be delivered to this address"})

            } catch (error) {
                console.log(error);
            }
        },


        confirmOrder : async (req,res) => {
            try {


                const paymntMthd = req.params.type
                const addressId = req.session.adrsId
                const userEmail = req.session.user
                const total = req.session.total
                const totalDiscount = req.session.totalDiscount
                const grandTotal = req.session.grandTotal

                const usr = await user.findOne({email:userEmail})

                console.log("1",usr);
                

                const [ addrs, carts] = await Promise.all([
                    await address.findOne({_id:addressId}),
                    await cart.findOne({userId:usr._id})
                ])
                console.log("2",addrs);
                console.log("3",carts);



                // date setting------------------------------------------

                const currentDate=new Date().toLocaleString("en-US", {
                    timeZone: "Asia/Kolkata",
                });


                
                // delivery date ----------------------------------------  

                const deliveryDate= new Date(
                    Date.now() + 4 * 24 * 60 * 60 * 1000
                ).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });  


                //   if not coupen code ---------------------------------

                let couponCode = "";
                let couponDiscount = 0;

                //   if coupen code--------------------------------------

                // if (req.session.couponDiscount && req.session.couponCode) {
                //     couponDiscount = req.session.couponDiscount;
                //     couponCode = req.session.couponCode;
                //     discountAmount=discountAmount-couponDiscount;
                // }  


                if(paymntMthd=="cashOnDelivery" && req.session.adrsId!=null){

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
                        expectedDeliveryDate:deliveryDate,
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

                    console.log("aa",prdts);

                    //to update the quantity in inventory

                    for (const data of prdts) {

                        try {
                            prdId = data.productid
                            ordrQty = data.quantity
    
                            const prdt = await product.findOne({_id:prdId})
                            console.log("cc",prdt);
                            const stock = prdt.stockQuantity
                            const newStock = stock - ordrQty
    
    
                            const test = await product.findOne({_id:prdId})
    
                            await product.updateOne({_id:prdId},{$set:{stockQuantity:newStock}})
    

                        } catch (error) {
                            console.log(error);
                        }

                    }
                    await cart.findByIdAndDelete(carts._id)
                    
                }else if(req.session.adrsId==null){

                    res.json({msg:"please select the address"})

                }else if(type!="cashOnDelivery"){

                    res.json({msg:"cashOnDelivery only available"})

                } 

            } catch (error) {
                console.log(error);
            }
        },


        myOrders : async (req,res) => {
            try {
                const usr = await user.findOne({email:req.session.user})


                const orders = await order.find({userid:usr._id}).populate("products.productid").sort({ orderDate: -1 })
                console.log("bbbbb",orders);

                res.render('user/myOrders',{orders,check: req.session.name})
            } catch (error) {
                console.log(error);
            }
        },



        myOrderDetails : async (req,res) => {
            try {
                const orderId = req.params.orderid
                const usrOdr = await order.findOne({_id:orderId}).populate("products.productid")
                console.log(usrOdr);

                res.render('user/myOrderDetails',{usrOdr,check: req.session.name})
            } catch (error) {
                console.log(error);
            }
        },


        cancelOrder : async (req,res) => {
            try {
                const orderId = req.params.orderid
                console.log("oo",orderId);
                const ordr = await order.findOne({_id:orderId})
                ordr.orderStatus = "Cancelled"
                await ordr.save();


                ordr.products.forEach(async data => {
                    const prdkt = await product.findOne({_id:data.productid})
                    if(prdkt){
                        prdkt.stockQuantity = prdkt.stockQuantity + data.quantity 
                        await prdkt.save()
                    } 
                });
                res.json({msg:"The Order cancelled successfully"})

            } catch (error) {
                console.log(error);
            }
        }

}