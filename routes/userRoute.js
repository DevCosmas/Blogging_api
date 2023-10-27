const express = require('express')
const userController = require('./../controller/userController')
const authController = require('./../controller/authController')
const router = express.Router()


router.use(authController.isAuthenticated)
router.delete("/delete", userController.deleteAcct)
router.patch("/update", userController.updateProfile)
router.post("/forgotPassword", userController.forgetPassword)
router.patch("/resetPassword/:token", userController.resetPassword)



module.exports = router


