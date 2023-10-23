const mongoose = require('mongoose')
const Schema = mongoose.Schema

const blogSchema = new Schema({
    title: {
        type: String,
        required: [true, 'a blog must have a title']
    },
    description: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    readCount: {
        type: Number,
        default: 0
    },
    readingTime: {
        type: number
    },
    bodyContent: {
        type: String
    },
    tags: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now()
    }
})

const blogModel = mongoose.model('blog', blogSchema)
module.exports = { blogModel }