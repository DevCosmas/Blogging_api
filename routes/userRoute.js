const express = require('express')
const userController = require('./../controller/userController')
const router = express.Router()

router.post("/signUp", userController.signUp)
router.post("/login", userController.Login)
router.delete("/delete", userController.deleteAcct)
router.patch("/update", userController.updateProfile)
router.post("/forgotPassword", userController.forgetPassword)
router.patch("/resetPassword/:token", userController.resetPassword)



module.exports = router


