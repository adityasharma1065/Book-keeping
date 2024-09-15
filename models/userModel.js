
const mongoose=require("mongoose")

var userSchema=mongoose.Schema({
    username:{
        type:String,
        unique:true,
        // required:true,
        trim:true,
        minlength: [4, 'Minimum length can be 4 characters'], // Custom error message for minlength
        maxlength: [30, 'Maximum length can be 30 characters'] 
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
        // required:true,
        // minLength:6,
    },
    hisaabID:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"hisaab"
    }]
})

userSchema.pre('save', function(next) {
    try {
        // Perform validation or other pre-save operations here
        next();
    } catch (error) {
        next(error);
    }
});

module.exports=mongoose.model("user",userSchema)