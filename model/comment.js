const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    blog: {
        type: mongoose.Schema.ObjectId,
        ref: 'blog'
    },
    comment: String,
    timestamp: { type: Date, default: Date.now }
})

const commentModel = mongoose.model('comment', commentSchema)
module.exports = { commentModel }