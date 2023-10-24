const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ratingSchema = new Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    blog: {
        type: mongoose.Schema.ObjectId,
        ref: 'blog'
    },
    rating: Number,
  
    timestamp: { type: Date, default: Date.now }
})

const ratingModel = mongoose.model('rating', ratingSchema)
module.exports = { ratingModel }