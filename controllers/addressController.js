
const address = require('../models/addressModel');
const user = require('../models/userModels');


module.exports = {

    //adding new user address
    PostAddAddress : async (req,res) => {
        try {
            const usrEmail = req.session.user
            const usr = await user.findOne({email:usrEmail})
            const usrData = await user.findOne({email:req.session.user})

            const id = usrData._id
            const adrs = await address.find({userId:id})

            //impp
            req.body.userId = usr._id
            console.log("postt");

            if(user){
                await address.create(req.body)
                const msg = "New address added succesfully"
                res.render('user/userProfile',{msg,usrData,adrs,check:req.session.name})
            }else{
                const msg = "Error occured while adding address"
                res.render('user/userProfile',{msg,usrData,adrs,check:req.session.name})
            }
        } catch (error) {
            console.log(error);
        }
    },

    postEditAddress : async (req,res) => {
        try {
            const newAdrs = req.body
            const usrId = newAdrs.userId
            const _Id = newAdrs.id

            console.log(newAdrs);
            console.log(_Id);

            const usrData = await user.findOne({email:req.session.user})
            const id = usrData._id
            const adrs = await address.find({userId:id})

            if(usrId!=""){
                await address.updateOne({_id:_Id},{$set:{name:newAdrs.name,mobile:newAdrs.mobile,address:newAdrs.address,pincode:newAdrs.pincode,locality:newAdrs.locality,city:newAdrs.city,district:newAdrs.district,state:newAdrs.state}})

                const msg = "Address updates successfully"
                res.render("user/userProfile",{msg,usrData,adrs,check:req.session.name})
            }else{
                const msg = "Select an existing address"
                res.render("user/userProfile",{msg,usrData,adrs,check:req.session.name})
            }

        } catch (error) {
            console.log(error);
        }
    },

    deleteAddress : async (req,res) => {
        try {
            const id = req.params.id
            console.log(id);
            await address.deleteOne({_id:id})
            res.json({msg:"Address Deleted Successfully"})
        } catch (error) {
            console.log(error);
        }
    },


}