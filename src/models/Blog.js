const mongoose = require('mongoose');
const { type } = require('os');

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String, // Use the author's username
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: { 
      type: [String], 
      default: [] }, 
      
    comments: [
      {
        username: String,
        comment: String,
        createdAt: {type: Date, default: Date.now},
      }
    ],
    imageUrl: {type:String },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Blog', BlogSchema);
