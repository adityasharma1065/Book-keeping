
const mongoose=require("mongoose")

var userSchema=mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        minLength:5,
        maxLength:20
    },
    name:{
        type:String,
        trim:true,
        required:true,

    },
    email:{
          type:String,
          unique:true,
          required:true,
          trim:true
    },
    password:{
        type:String,
        required:true,
        minLength:6,
    },
    hisaabID:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"hisaab"
    }]
})

module.exports=mongoose.model("user",userSchema)