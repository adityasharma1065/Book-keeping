const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const userModel=require("../models/userModel")
const validator = require('email-validator');

function validateEmail(email) {
    return validator.validate(email);
}

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

    let byDate=Number(req.query.byDate)
  
    let startDate=req.query.startDate
     startDate= startDate? new Date(req.query.startDate):  new Date("1980-01-01") 
    let endDate=  req.query.endDate

    endDate=endDate?new Date(endDate):new Date()
    endDate=endDate.getTime()+24*60*60*1000
    
    byDate = byDate? byDate:-1
    

    var user=await userModel.findOne({
        email:req.user.email
      }).populate({
        
          path:"hisaabID",
          match:{createdAt:{$gte:startDate,$lte:endDate}},
          options: {sort:{createdAt:byDate}}
      }
      )
      res.render("profile", { user ,errmsg});   
}



module.exports.registerUserController = async (req, res) => {
    try {
        let { name, username, password, email } = req.body;
        if(!validateEmail(email)){
            req.flash("error","Please provide a correct email")
            return res.redirect("/register")
        }


        var user = await userModel.findOne({ email });
        if (user) {
            req.flash("error", "User already exists");
            return res.redirect("/register");
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        try {
            user = await userModel.create({
                username, name, email, password: hash
            });
        } catch (validationError) {
            if (validationError.name === 'ValidationError') {
                const messages = Object.values(validationError.errors).map(val => val.message);
                req.flash("error", messages.join(' '));
                return res.redirect("/register");
            } else {
                throw validationError; // Rethrow if not a validation error
            }
        }

        var token = jwt.sign({ email: user.email, id: user._id }, process.env.SEC_KEY);
        res.cookie("token", token);
        res.redirect("/profile");
    } catch (error) {
        if (error.code === 11000) {
            req.flash("error", "Username already exists");
            return res.redirect("/register");
        } else {
            req.flash("error", "Server error");
            return res.redirect("/register");
        }
    }
};




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
        req.flash("error","Invalid Credentials")
        res.redirect("/")
    }

}
    

module.exports.logoutController=(req,res)=>{
    res.cookie("token","")
    res.redirect("/")
}
    
