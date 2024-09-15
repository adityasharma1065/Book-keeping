const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const express=require("express")
const router=express.Router()
const userModel=require("../models/userModel")
var jwt = require("jsonwebtoken");

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  async function(accessToken, refreshToken, profile, done) {
    
    var user;
    
    
    user=await userModel.findOne({email:profile.emails[0].value})
    if(!user){
          var name=profile.displayName+"_"+Math.floor(Math.random()*10000)+"_"+Math.floor(Math.random()*100000)
          user= new userModel({
            username:name,
            name:profile.name.givenName,
            email:profile.emails[0].value,
            hisaabID:[]
          })
          await user.save()
        
    }
    
    
    

    return done(null, profile);
  }));

  passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );
  
  router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    async (req, res) => {
    
    var user=await userModel.findOne({email:req.user.emails[0].value})
    
    console.log(user.email);
    
    var token=jwt.sign({email:user.email,id:user._id},process.env.SEC_KEY)
    res.cookie("token",token)
    res.redirect("/profile")
    
    
    }
  );

  module.exports = router;