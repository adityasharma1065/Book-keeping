var jwt = require("jsonwebtoken");
var userModel = require("../models/userModel");
var hisaabModel = require("../models/hisaabModel");

module.exports.isLoggedin=(req,res,next)=>{
    
    try{if(req.cookies.token){jwt.verify(req.cookies.token,process.env.SEC_KEY,async (err,decoded)=>{
          
          var user=await userModel.findOne({email:decoded.email}).select("-password");
          req.user=user
          next();
    })}
    else{
        req.flash("error","please login")
        res.redirect("/")
    }}
    catch(err){
        req.flash("error",err)
        res.redirect("/")
    }
}

module.exports.redirectIfLoggedin=(req,res,next)=>{
    if(req.cookies.token){
        try{var decoded=jwt.verify(req.cookies.token,process.env.SEC_KEY)
        var redirectTo= req.get("Referer") || "/profile";
        res.redirect(redirectTo);}
        catch(err){
            next();
        }
    }
    else{
        next();
    }
}

module.exports.checkPass=async (req,res,next)=>{
    hisaabModel.findOne({_id:req.params.id})
    .then((hisaab)=>{
        
        if(hisaab.encrypted){
            
            var flagmessage=req.flash("flag")
            
            var flag=flagmessage.length==0? false:flagmessage[0]

            
            if(flag){
                next()
            }
            else{
                
                
                res.redirect(`/hisaab/${req.params.id}/verify`)
                
        
            }
        }
        else{
            next()
        }
    })
    
}