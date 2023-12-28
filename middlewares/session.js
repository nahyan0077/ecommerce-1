

module.exports = {


    //------------------------user

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
    //-------------------------------admin

    //after login
    verifyAdmin : (req,res,next) => {
        if(req.session.adminlogged){
            next()
        }else{
            res.redirect('/adminlogin')
        }
    },

    //before login 
    adminExist : (req,res,next) => {
        if(req.session.admin){
            res.redirect('admindash')
        }else{
            next()
        }
    }
    

}






