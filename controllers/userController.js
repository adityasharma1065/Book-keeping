const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const userModel=require("../models/userModel")

module.exports.landingPageController=(req,res)=>{
    const errmsg=req.flash("error")
    res.render("index",{errmsg,nav:false})   
}
module.exports.registerPageController=(req,res)=>{
    const errmsg=req.flash("error")
    res.render("register",{errmsg,nav:false})   
}
module.exports.profilePageController=async (req,res)=>{
    const errmsg=req.flash("error")
    var user=await userModel.findOne({
        email:req.user.email
      }).populate("hisaabID")
      res.render("profile", { user ,errmsg});   
}



module.exports.registerUserController=async (req,res)=>{
   try{ let{name,username,password,email}=req.body
    var user=await userModel.findOne({email})

    if(user){
        req.flash("error","user already exist")
        return res.redirect("/register")
    }

    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async(err,hash)=>{
            var user=await userModel.create({
                username,name,email,password:hash
            })

            var token=jwt.sign({email,id:user._id},process.env.SEC_KEY)
            res.cookie("token",token)
            res.redirect("/profile")
        })
    })}
    catch(err){
        req.flash("error",err)
        res.redirect("/register")
    }
}




module.exports.loginController=async (req,res)=>{
    try{let{email,password}=req.body
    var user=await userModel.findOne({email})

    bcrypt.compare(password,user.password,(err,result)=>{
        if(!result){
            req.flash("error","Invalid Credentials")
            return res.redirect("/")
        }
        var token=jwt.sign({email,id:user._id},process.env.SEC_KEY)
        res.cookie("token",token)
        res.redirect("/profile")
         
    })}
    catch(err){
        req.flash("error",err)
        res.redirect("/")
    }

}
    

module.exports.logoutController=(req,res)=>{
    res.cookie("token","")
    res.redirect("/")
}
    
