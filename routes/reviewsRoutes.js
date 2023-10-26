const express = require('express')
const reviewController = require('./../controller/reviewsController')
const router = express.Router({mergeParams:true})


router.post("/makeReviews", reviewController.makeReviews)
router.get("/allReviews", reviewController.seeReviews)
router.patch("/:reviewId", reviewController.updateReviews)
router.delete("/:reviewId", reviewController.deleteReviews)



module.exports = router

