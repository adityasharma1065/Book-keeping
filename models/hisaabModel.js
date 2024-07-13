
const mongoose=require("mongoose")


var hisaabSchema=mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:true,
        minLength:3,
            maxLength:100,

    },
    description:{
        type:String,
        trim:true,

    },
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    encrypted:{
        type:Boolean,
        default:false

    },
    shareable:{
        type:Boolean,
        default:false
    },
    editpermission:{
        type:Boolean,
        default:false
    },
    passcode:{
        type:String,
        default:""

    }
},{timestamps:true})

module.exports=mongoose.model("hisaab",hisaabSchema)