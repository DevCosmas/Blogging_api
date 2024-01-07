const { reviewModel } = require('./../model/reviews');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const appError = require('../utils/errorhandler');
const SendResponse = require('../utils/sendJsonResponse');

const makeReviews = async (req, res, next) => {
  const sendResponse = new SendResponse(res);
  try {
    if (!req.user.active === true)
      return next(
        new appError('You are not authorized. Kindly sign up or login')
      );
    const review = req.body;
    if (!review.user) review.user = req.user.id;
    if (!review.blog) review.blog = req.params.blogId;
    const newReview = await reviewModel.create(review);

    sendResponse.sendJson(newReview, 'A new review has be made', 201);
  } catch (err) {
    next(new appError(err, 500));
  }
};
const seeReviews = async (req, res, next) => {
    const sendResponse = new SendResponse(res);
  try {
    let filter = {};
    if (req.params.blogId) filter = { blog: req.params.blogId };
    const allReviews = await reviewModel.find(filter);
    if (!allReviews) return next(new appError('empty reviews', 404));
    sendResponse.sendJson(
      allReviews,
      'These are all reviews for this blog',
      200
    );
  } catch (err) {
    next(new appError(err, 500));
  }
};
const updateReviews = async (req, res, next) => {
    const sendResponse = new SendResponse(res);
  try {
    if (!req.user.active === true)
      return next(
        new appError('You are not authorized. Kindly sign up or login')
      );
    const review = await reviewModel.findOne({ blog: req.params.blogId });
    if (review.user.id === req.user.id) {
      const update = req.body;
      const updateReviews = await reviewModel.findByIdAndUpdate(
        req.params.reviewId,
        update,
        { new: true }
      );
      if (!updateReviews)
        return next(new appError('no update for review', 404));
      sendResponse.sendJson(
        updateReviews,
        'review has been updated for this blog',
        200
      );
    } else {
      next(new appError('You need to log in', 401));
    }
  } catch (err) {
    next(new appError(err, 500));
  }
};

const deleteReviews = async (req, res, next) => {
    const sendResponse = new SendResponse(res);

  try {
    if (!req.user.active === true)
      return next(
        new appError('You are not authorized. Kindly sign up or login')
      );
    const review = await reviewModel.findOne({ blog: req.params.blogId });
    if (review.user.id === req.user.id) {
      const deleteReviews = await reviewModel.findByIdAndDelete(
        req.params.reviewId
      );
      if (!deleteReviews)
        return next(
          new appError('no delete has been made for the review', 404)
        );
        sendResponse.sendJson(
        deleteReviews,
        'Review has been deleted for this blog',
        203
      );
    } else {
      next(new appError('user is not permitted to carry action', 401));
    }
  } catch (err) {
    next(new appError(err, 500));
  }
};

module.exports = {
  makeReviews,
  seeReviews,
  updateReviews,
  deleteReviews,
};
