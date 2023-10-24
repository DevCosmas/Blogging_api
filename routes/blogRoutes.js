const express = require('express')
const blogController = require('./../controller/blogController')
const authController = require('./../controller/authController')

const router = express.Router()

// ACCESSABLE BY BOTH LOGGED IN AND NON LOGGED IN USERS
router.get("/allBlog", blogController.allBlog)

router.use(authController.isAuthenticated)
// ONLY ACCESSABLE BY LOGGED IN USERS
router.post("/createblog", blogController.createBlog)
router.get("/myBlog", blogController.myBlog)
router.patch("/updateBlog/:blogId", blogController.updateBlog)
router.delete("/deleteBlog/:blogId", blogController.deleteBlog)
router.patch("/publishBlog/:blogId", blogController.publishBlog)


module.exports = router