var cron = require('node-cron');
const category = require('../models/categoryModels');
const offer = require('../models/offerModel');
const product = require('../models/productModels')



const checkOffers = async () => {
    try {
        const currentDate = new Date()
        const offers = await offer.find({expiryDate:{$lte:currentDate}})

        if(offers.length > 0){
            for(const expOff of offers){
                const expiredPrdkts = await product.find({category:expOff.categoryName})
                for(const data of expiredPrdkts){
                    const beforeOffer = data.beforeOffer
                    await product.findByIdAndUpdate(
                        data._id,
                        {$set:{DiscountAmount:beforeOffer, beforeOffer: 0, inCategoryOffer: false}},
                        {new:true}
                    )
                }
                await offer.findByIdAndDelete(expOff._id);
            }
        }

    } catch (error) {
        console.log(error);
    }
}


// cron.schedule("*/10 * * * * *", async () => {
//     try {
//         console.log('running every 10 seconds');
//       await checkOffers();
//     } catch (error) {
//       console.error("Error in cron job:", error);
//     }
//   });
    
