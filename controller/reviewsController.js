const { reviewModel } = require('./../model/reviews')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const appError = require('../utils/errorhandler')

const makeReviews = async (req, res, next) => {
    try {
        if (!req.user.active === true) return next(new appError('You are not authorized. Kindly sign up or login'))
        const review = req.body
        if (!review.user) review.user = req.user.id
        if (!review.blog) review.blog = req.params.blogId
        const newReview = await reviewModel.create(review)
        res.status(201).json({
            result: 'SUCCESS',
            message: 'A new review has be made',
            newReview
        })
    } catch (err) {
        next(new appError(err, 500))
    }
}
const seeReviews = async (req, res, next) => {
    try {
        let filter = {}
        if (req.params.blogId) filter = { blog: req.params.blogId }
        const allReviews = await reviewModel.find(filter)
        if (!allReviews) return next(new appError('empty reviews', 404))
        res.status(200).json({
            result: 'SUCCESS',
            message: 'These are all reviews for this blog',
            size: allReviews.length,
            allReviews
        })
    } catch (err) {
        next(new appError(err, 500))
    }
}
const updateReviews = async (req, res, next) => {
    try {
        if (!req.user.active === true) return next(new appError('You are not authorized. Kindly sign up or login'))
        const review = await reviewModel.findOne({ blog: req.params.blogId })
        if (review.user.id === req.user.id) {
            const update = req.body
            const updateReviews = await reviewModel.
                findByIdAndUpdate(
                    req.params.reviewId,
                    update,
                    { new: true })
            if (!updateReviews) return next(new appError('no update for review', 404))
            res.status(200).json({
                result: 'SUCCESS',
                message: 'review has been updated for this blog',
                updateReviews
            })
        }
        else {
            next(new appError('user is not permitted to carry action', 401))
        }
    } catch (err) {
        next(new appError(err, 500))
    }
}

const deleteReviews = async (req, res, next) => {
    try {
        if (!req.user.active === true) return next(new appError('You are not authorized. Kindly sign up or login'))
        const review = await reviewModel.findOne({ blog: req.params.blogId })
        if (review.user.id === req.user.id) {
            const deleteReviews = await reviewModel.findByIdAndDelete(req.params.reviewId)
            if (!deleteReviews) return next(new appError('no delete has been made for the review', 404))
            res.status(203).json({
                result: 'SUCCESS',
                message: 'review has been deleted for this blog',
            })
        }
        else {
            next(new appError('user is not permitted to carry action', 401))
        }
    } catch (err) {
        next(new appError(err, 500))
    }
}

module.exports = {
    makeReviews,
    seeReviews,
    updateReviews,
    deleteReviews
}