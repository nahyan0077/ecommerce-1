const category = require('../models/categoryModels');
const offer = require('../models/offerModel');
const product = require('../models/productModels')

module.exports = {

    //render offer page in admin side
    getOffers : async (req,res) => {
        try {
            const successMessage = req.session.successMessage;
            const errorMessage = req.session.errorMessage;
            delete req.session.successMessage;
            delete req.session.errorMessage;

            const [offers, catgry] = await Promise.all([
                offer.find().populate('category_id'),
                category.find()
            ])

            res.render('admin/adminOffers',{catgry, successMessage, errorMessage, offers})

        } catch (error) {
            console.log(error);
        }
    },


    //postAddOffers
    addOffers : async (req,res) => {
        try {
            console.log(req.body);
            const {category_id, offerPercentage, expiryDate} = req.body

            const offerExist = await offer.findOne({category_id:category_id})

            if(!offerExist){
                await offer.create(req.body)

                const catgryPrdkt = await product.find({category_id:category_id})
                const offerMultiplier = 1 - offerPercentage/100
                
                for(const prdkt of catgryPrdkt){
                    const discountPrice = prdkt.DiscountAmount
                    const newPrice = Math.floor(prdkt.DiscountAmount * offerMultiplier)

                    await product.updateOne(
                        {_id:prdkt._id},
                        {$set:{inCategoryOffer: true, beforeOffer: discountPrice, DiscountAmount: newPrice}})
                }

                req.session.successMessage = 'New offer added successfully';

                res.redirect('/adminoffers')

            }else{
                req.session.errorMessage = 'Offer on this category already Exists';
                res.redirect('/adminoffers')
            }

            
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },


    getEditOffer : async (req,res) => {
        try {
            const {offerid} = req.params

            const [offr, catgry] = await Promise.all([
                offer.findOne({_id:offerid}).populate('category_id'),
                category.find()
            ])

            res.render('admin/editOffers',{offr, catgry})
        } catch (error) {
            console.log(error);
        }
    },

    postEditOffers : async (req,res) => {
        try {
            
            const { offerid, oldCategory, category_id, offerPercentage, expiryDate } = req.body

            const offrExist = await offer.findOne({category_id:category_id}).populate('category_id')

            if(offrExist && oldCategory!=offrExist.category_id.categoryName){
                req.session.errorMessage = 'Offer on this category already Exists';
            }else{
                // updating the order
                await offer.findByIdAndUpdate(
                    offerid,
                    {category_id, offerPercentage, expiryDate},
                    {new:true}
                )
                
                // resetting the offer details for the old offer products
                const oldPrdkts = await product.find({category:oldCategory})
                for(const data of oldPrdkts){
                    const beforeOffer = data.beforeOffer
                    await product.findByIdAndUpdate(
                        data._id,
                        {$set:{DiscountAmount:beforeOffer, beforeOffer: 0, inCategoryOffer: false}},
                        {new:true}
                    )
                }

                //updating offer details on the new offer products
                const newPrdkts = await product.find({category:category_id})
                const offerMultiplier = 1 - offerPercentage/100
                
                for(const prdkt of newPrdkts){
                    const discountPrice = prdkt.DiscountAmount
                    const newPrice = Math.floor(prdkt.DiscountAmount * offerMultiplier)

                    await product.updateOne(
                        {_id:prdkt._id},
                        {$set:{inCategoryOffer: true, beforeOffer: discountPrice, DiscountAmount: newPrice}})
                }

                req.session.successMessage = 'Offer details updated successfully';
            }

            res.redirect('/adminoffers')

        } catch (error) {
            console.log(error);
        }
    },


    deleteOffers : async (req,res) => {
        try {
            const {offerid} = req.params

            const ofrData = await offer.findById(offerid)
            const prdkts = await product.find({category_id:ofrData.category_id})

            for(const data of prdkts){
                const beforeOffer = data.beforeOffer
                await product.findByIdAndUpdate(
                    data._id,
                    {$set:{DiscountAmount:beforeOffer, beforeOffer: 0, inCategoryOffer: false}},
                    {new:true}
                )
            }
            await offer.findByIdAndDelete(offerid)
            res.json({success: true, msg: 'Offer deleted successfully'})

        } catch (error) {
            console.log(error);
        }
    }
}