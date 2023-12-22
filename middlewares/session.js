

module.exports = {

    loginSession : (req,res,next)=>{
        if(req.session.user){
            res.render('userHome')
        }else{
            next()
        }
    },
    

}





