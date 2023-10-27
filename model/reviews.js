const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId
const { blogModel } = require('./../model/blog')

const reviewSchema = new Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    blog: {
        type: mongoose.Schema.ObjectId,
        ref: 'blog'
    },
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    timestamp: { type: Date, default: Date.now }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)
reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        localField: 'id',
        foreignField: '_id',
        model: 'user',
        select: 'firstname photo id '
    });
    next();
})

reviewSchema.statics.calcAvgRating = async function (blogId) {
    const stats = await this.aggregate([
        {
            $match: { blog: blogId }
        },
        {
            $group: {
                _id: '$blog',
                numOfRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ])
    await blogModel.findByIdAndUpdate(blogId, {
        numOfRating: stats[0].numOfRating,
        ratingAvg: stats[0].avgRating
    }, { new: true })
}

reviewSchema.post('save', function () {
    this.constructor.calcAvgRating(this.blog);

})

const reviewModel = mongoose.model('reviews', reviewSchema)
module.exports = { reviewModel }