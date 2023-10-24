const express = require('express')
const blogController = require('./../controller/blogController')
const authController = require('./../controller/authController')

const router = express.Router()
router.get("/allBlog", blogController.allBlog)
router.use(authController.isAuthenticated)

router.post("/createblog", blogController.createBlog)


// router.delete("/delete", userController.deleteAcct)
// router.patch("/update", userController.updateProfile)
// router.post("/forgotPassword", userController.forgetPassword)
// router.patch("/resetPassword/:token", userController.resetPassword)/createBlog", blogController.createBlog)
// 



module.exports = router