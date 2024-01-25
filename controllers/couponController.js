const coupon = require('../models/couponModel')

module.exports = {

    //admin coupon page
    getCoupon: async (req, res) => {
        try {
            //for success alert
            const successMessage = req.session.successMessage;
            const errorMessage = req.session.errorMessage;
            delete req.session.successMessage;
            delete req.session.errorMessage;

            const cupn = await coupon.find()

            res.render('admin/adminCoupon', { successMessage, cupn, errorMessage })
        } catch (error) {
            console.log(error);
        }
    },


    //add coupon
    addCoupon: async (req, res) => {
        try {
            console.log(req.body);
            const cpn = await coupon.findOne({ couponCode: new RegExp(req.body.couponCode, 'i') });
            console.log(cpn);
            if (!cpn) {
                req.session.successMessage = 'Coupon added successfully';
                await coupon.create(req.body)
                res.redirect('/admincoupon')
            } else {
                req.session.errorMessage = 'This Coupon already Exists';
                res.redirect('/admincoupon')
            }

        } catch (error) {
            console.log(error);
        }
    },


    //delete a coupon
    deleteCoupon: async (req, res) => {
        try {

            await coupon.deleteOne({ _id: req.params.cupnId })
            
            res.json({ msg: "Coupon deleted successfully" })

        } catch (error) {
            console.log(error);
        }
    },


    //render edit coupon page
    getEditCoupon: async (req, res) => {
        try {
            console.log(req.params.id);
            const cupn = await coupon.findOne({ _id: req.params.id })
            res.render('admin/editCoupon', { cupn })
        } catch (error) {
            console.log(error);
        }
    },

    //post edit coupon details
    postEditCoupon: async (req, res) => {
        try {
            console.log(req.body);
            console.log(req.params.id);

            const data = req.body

            const cpn = await coupon.findOne({ couponCode: req.body.couponCode })

            if (req.body.couponCode == req.body.oldCouponCode && cpn || req.body.couponCode != req.body.oldCouponCode && !cpn) {
                await coupon.updateOne({ _id: req.params.id }, { $set: { ...data } })
                req.session.successMessage = 'Coupon editted successfully';
                res.redirect('/admincoupon')
            } else {
                req.session.errorMessage = 'This coupon already exists';
                res.redirect('/admincoupon')
            }

        } catch (error) {
            console.log(error);
        }
    },


    //show coupons on user side
    userCoupons: (req, res) => {
        try {
            res.render('user/userCoupons')
        } catch (error) {
            console.log(error);
        }
    },


    // apply coupon
    applyCoupon: async (req, res) => {
        try {

            const { couponCode } = req.body
            const grandTotal = req.session.grandTotal;
            const date = new Date();

            // Check if a coupon has already been applied
            if (req.session.couponCode) {
                const appliedCoupon = await coupon.findOne({ couponCode: req.session.couponCode });

                if (appliedCoupon) {
                    const alreadyAppliedMsg = "A coupon has already been applied to this order.";
                    res.json({ errMsg: alreadyAppliedMsg, alreadyApplied: true });
                    return;
                }
            }

            const couponData = await coupon.findOne({ couponCode: couponCode });

            if (couponData != null && date < couponData.validTo && grandTotal >= couponData.minPurchaseAmount) {
                req.session.grandTotal = grandTotal - couponData.discountAmount;
                req.session.couponCode = couponData.couponCode;
                req.session.cpnDiscount = couponData.discountAmount

                console.log(req.session.grandTotal);
                const appliedSuccessfullyMsg = "Coupon Applied Successfully";
                req.session.cpnMsg = true;
                res.json({ msg: appliedSuccessfullyMsg, alreadyApplied: false });
            } else {
                const invalidCouponMsg = "Invalid Coupon Code or Minimum Purchase Amount not met";
                req.session.cpnMsg = false;
                res.json({ errMsg: invalidCouponMsg, alreadyApplied: false });
            }

        } catch (error) {
            console.log(error);
        }
    },






}

