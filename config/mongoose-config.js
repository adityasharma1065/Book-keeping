const mongoose=require("mongoose")

mongoose.connect(process.env.MONGOURI)
.then(()=>{
    console.log("Connected to Server")
})
.catch(err => console.log('Failed to connect to MongoDB', err));

module.exports=mongoose.connection