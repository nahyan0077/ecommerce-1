

module.exports = {

    //after login
    verifyUser : (req,res,next)=>{
        if(req.session.userlogged){
            next()
        }else{
            console.log("sds");
            res.redirect('/')
        }
    },

    //before login
    userExist : (req,res,next)=>{
        if(req.session.user){
            res.redirect('/userhome')
        }else{
            next()
        }
    },
    

}





