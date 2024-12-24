const express = require('express');
const authenticateToken = require('../middlewares/auth');
const router = express.Router();
const Blog = require('../models/Blog');

// Example: Protected route for posting a blog
router.post('/create', authenticateToken, async (req, res) => {
    const { title, content } = req.body;
  
    // Validate input
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
  
    // Access user info from req.user
    const user = req.user;
  
    try {
      // Create a new blog post
      const blog = new Blog({
        title,
        content,
        author: user.username, // Use the username from the authenticated user
      });
  
      // Save the blog post to the database
      const savedBlog = await blog.save();
  
      // Return the saved blog as a response
      return res.status(201).json({
        message: 'Blog created successfully',
        blog: savedBlog,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  

// Route to get all blogs
router.get('/', async (req, res) => {
    try {
      const blogs = await Blog.find().sort({ createdAt: -1 }); // Fetch blogs in descending order of creation
      return res.status(200).json(blogs);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router;
