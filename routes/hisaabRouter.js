const express=require("express")
const router=express.Router()

let{createHisaabController, createHisaabPageController, hisaabViewController, passcodeController,passcodePageController, deleteController, editpageController, editHisaabController}=require("../controllers/hisaabController")

let{isLoggedin,redirectIfLoggedin,checkPass}=require("../middlewares/middlewares")

router.get("/create",isLoggedin,createHisaabPageController)
router.get("/view/:id",isLoggedin,checkPass,hisaabViewController)
router.get("/:id/verify",passcodePageController)
router.get("/delete/:id",isLoggedin,deleteController)
router.get("/edit/:id",isLoggedin,editpageController)

router.post("/create",isLoggedin,createHisaabController)
router.post("/:id/verify",passcodeController)
router.post("/edit/:id",isLoggedin,editHisaabController)


module.exports=router;