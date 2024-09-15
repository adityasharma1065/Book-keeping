require('dotenv').config();
const express=require("express")
const app=express()
const cookieParser=require("cookie-parser")
const flash=require("connect-flash")
const passport = require('passport');
const expressSession=require("express-session")
require("./config/mongoose-config")

app.set("view engine","ejs")

app.use(flash())
app.use(expressSession({
    resave:false,
    saveUninitialized:false,
    secret:process.env.SESSION
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

let userRouter=require("./routes/userRouter")
let hisaabRouter=require("./routes/hisaabRouter")
let googleAuth=require("./config/googleAuth")

app.use("/auth",googleAuth)
app.use("/",userRouter)
app.use("/hisaab",hisaabRouter)

app.get('*', (req, res) => {
    return res.render('invalid');
});

app.listen(3000)