const hisaabModel=require("../models/hisaabModel")
const userModel=require("../models/userModel")

module.exports.createHisaabPageController=(req,res)=>{
    var errmsg=req.flash("error")
    res.render("create",{errmsg})
}

module.exports.createHisaabController=async (req,res)=>{
    try{let{title,description,encrypted,shareable,editpermission,passcode}=req.body

    shareable=shareable=="on"? true:false
    editpermission=editpermission=="on"? true:false
    encrypted=encrypted=="on"? true:false

    
    var hisaab =await hisaabModel.create({
        title,description,encrypted,shareable,editpermission,passcode,userID:req.user.id
    })
    var user= await userModel.findOne({email:req.user.email})
    
    user.hisaabID.push(hisaab.id)
    user.save()

    res.redirect("/profile")}
    catch(err){
        console.log(err);
        // req.flash("error",err.message)
        res.send(err.message)
    }

}

module.exports.hisaabViewController=async (req,res)=>{
     hisaabModel.findOne({_id:req.params.id})
    .then((hisaab)=>{
    
        res.render("hisaab",{hisaab})
    })

    
    
    
}



module.exports.passcodePageController=async(req,res)=>{
    hisaabModel.findOne({_id:req.params.id})
    .then((hisaab)=>{
        var errmsg=req.flash("error")
        res.render("passcode",{hisaab,errmsg})
    })
}


module.exports.passcodeController= (req,res)=>{
    var hissab = hisaabModel.findOne({_id:req.params.id})
    .then((hisaab)=>{
        if(hisaab.passcode==req.body.passcode){
            req.flash("flag",true)
            res.redirect(`/hisaab/view/${hisaab._id}`)
        }
        else{
           req.flash("error","Incorrect passcode")
           res.redirect(`/hisaab/${hisaab.id}/verify`)
        }
    })
    

}

module.exports.deleteController=async(req,res)=>{
    
    var user=await userModel.findOne({email:req.user.email})
    if(user.hisaabID.includes(req.params.id)){
        await hisaabModel.deleteOne({_id:req.params.id})
        const index = user.hisaabID.indexOf(req.params.id);
        console.log(index);
    if (index !== -1) {
        user.hisaabID.splice(index, 1);
        await user.save()
    }
        
    }
    res.redirect("/profile")

}

module.exports.editpageController=async(req,res)=>{
    var hisaab=await hisaabModel.findOne({_id:req.params.id})
    res.render("edit",{hisaab})
}

module.exports.editHisaabController=async(req,res)=>{
    var hisaab=await hisaabModel.findOne({_id:req.params.id})

    hisaab.description = req.body.description;
    hisaab.title = req.body.title;
    hisaab.encrypted = req.body.encrypted == "on"; 
    hisaab.sharable = req.body.sharable == "on";
    hisaab.passcode = req.body.passcode;
    hisaab.editpermission = req.body.editpermission == "on";
    await hisaab.save();
    res.redirect(`/hisaab/view/${hisaab._id}`)

}