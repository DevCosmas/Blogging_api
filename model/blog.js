const mongoose = require('mongoose')
const Schema = mongoose.Schema
const appError = require('../utils/errorhandler')

const blogSchema = new Schema({
    title: {
        type: String,
        required: [true, 'a blog must have a title'],
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    coverImg: {
        type: String
    },
    readCount: {
        type: Number,
        default: 0
    },
    readingTime: {
        type: Number
    },
    bodyContent: {
        type: String,
        required: [true, 'a blog must have content']
    },
    tags: {
        type: String,
        toLowerCase: true
    },
    state: {
        type: String,
        default: 'draft',
        enum: ['draft', 'published']
    },
    ratingAvg: {
        type: Number,
        default: 3.5,
        set: val => Math.round(val * 10) / 10
    },
    numOfRating: {
        type: Number,
        default: 0
    },
    timestamp: {
        type: Date,
        default: Date.now()
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }

)
blogSchema.methods.calReadTime = function (content) {

    if (typeof content !== 'string' || content.trim() === '') {
        return 0;
    }
    let wpm = 250
    const word = content.split(/\s+/)
    const wordCount = word.length
    const readTime = wordCount / wpm
    return Math.ceil(readTime);

}

blogSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'author',
        localField: 'id',
        foreignField: '_id',
        model: 'user',
        select: 'firstname id'
    });
    next();
})

blogSchema.virtual('reviews', {
    ref: 'reviews',
    foreignField: 'blog',
    localField: '_id'
})




const blogModel = mongoose.model('blog', blogSchema)
module.exports = { blogModel }