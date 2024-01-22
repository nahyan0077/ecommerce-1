
const address = require('../models/addressModel');
const user = require('../models/userModels');
const coupon = require('../models/couponModel')
const wallet = require('../models/walletModel')


module.exports = {

    //adding new user address
    PostAddAddress: async (req, res) => {
        try {
            const usrEmail = req.session.user

            const [usr, usrData] = await Promise.all([
                user.findOne({ email: usrEmail }),
                user.findOne({ email: req.session.user })
            ])

            const id = usrData._id

            //impp
            req.body.userId = usr._id
            console.log("postt");

            if (user) {
                await address.create(req.body)
                req.session.successMessage = "New address added succesfully";

                res.redirect('/userprofile')
            } else {
                req.session.errorMessage = "Error occured while adding address";
                res.redirect('/userprofile')
            }
        } catch (error) {
            console.log(error);
        }
    },

    //adding new user address
    PostAddAddressCheckout: async (req, res) => {
        try {
            const usrEmail = req.session.user

            const [usr, usrData] = await Promise.all([
                user.findOne({ email: usrEmail }),
                user.findOne({ email: req.session.user })
            ])

            const id = usrData._id

            //impp
            req.body.userId = usr._id
            console.log("postt");

            if (user) {
                await address.create(req.body)
                req.session.successMessage = "New address added succesfully";

                res.redirect('/checkout')
            } else {
                req.session.errorMessage = "Error occured while adding address";
                res.redirect('/checkout')
            }
        } catch (error) {
            console.log(error);
        }
    },

    postEditAddress: async (req, res) => {
        try {
            const newAdrs = req.body
            const usrId = newAdrs.userId
            const _Id = newAdrs.id

            const usrData = await user.findOne({ email: req.session.user })
            const id = usrData._id

            if (usrId != "") {
                await address.updateOne({ _id: _Id }, { $set: { name: newAdrs.name, mobile: newAdrs.mobile, address: newAdrs.address, pincode: newAdrs.pincode, locality: newAdrs.locality, city: newAdrs.city, district: newAdrs.district, state: newAdrs.state } })

                req.session.successMessage = "Address updated successfully";
                res.redirect('/userprofile')
            } else {
                const msg = "Select an existing address"
                req.session.errorMessage = "Error occured while adding address";
                res.redirect('/userprofile')
            }

        } catch (error) {
            console.log(error);
        }
    },

    

    deleteAddress: async (req, res) => {
        try {
            const id = req.params.id
            console.log(id);
            await address.deleteOne({ _id: id })
            res.json({ msg: "Address Deleted Successfully" })
        } catch (error) {
            console.log(error);
        }
    },


}