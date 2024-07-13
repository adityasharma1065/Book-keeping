const express=require("express")
const router=express.Router()

let{
    landingPageController,
    registerPageController,
    profilePageController,
    registerUserController,
    loginController,
    logoutController
}=require("../controllers/userController")

let{isLoggedin,redirectIfLoggedin}=require("../middlewares/middlewares")

router.get("/",redirectIfLoggedin,landingPageController)
router.get("/register",redirectIfLoggedin,registerPageController)
router.get("/profile",isLoggedin,profilePageController)
router.get("/logout",logoutController)

router.post("/register",registerUserController)
router.post("/",loginController)



module.exports=router;
