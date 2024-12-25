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
  



  // Route to fetch blogs created by the logged-in user
router.get('/user', authenticateToken, async (req, res) => {
  console.log('testing');

  try {
    console.log('req.user:', req.user); // Log the user object received from middleware
    const username = req.user.username;
    console.log('Querying blogs for author (username):', username); // Log the username being queried

    // Wrap the query in a try-catch block to isolate the error
    let userBlogs;
    try {
      console.log('Executing query with:', { author: username });
      userBlogs = await Blog.find({ author: "testuser" }).sort({ createdAt: -1 });
      console.log('Query successful, results:', userBlogs);
    } catch (queryError) {
      console.error('Error during query execution:', queryError); // Log query-specific errors
      return res.status(500).json({ message: 'Query execution failed' });
    }

    return res.status(200).json(userBlogs);
  } catch (error) {
    console.error('Error in /user route:', error); // Log general route errors
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Edit blog
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const blogId = req.params.id; // Extract the ID from the route parameter
    console.log('Received blogId:', blogId); // Debug log to check the ID

    const { title, content } = req.body;
    const username = req.user.username;

    // Validate input
    if (!title && !content) {
      return res.status(400).json({ message: 'Nothing to update' });
    }

    // Find the blog and verify ownership
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    if (blog.author !== username) {
      return res.status(403).json({ message: 'Unauthorized to edit this blog' });
    }

    // Update the blog
    if (title) blog.title = title;
    if (content) blog.content = content;

    const updatedBlog = await blog.save();
    return res.status(200).json({ message: 'Blog updated successfully', blog: updatedBlog });
  } catch (error) {
    console.error('Error updating blog:', error); // Log the error
    return res.status(500).json({ message: 'Internal server error' });
  }
});



// Delete Blog
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const blogId = req.params.id;
    const username = req.user.username;

    // Find the blog and verify ownership
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    if (blog.author !== username) {
      return res.status(403).json({ message: 'Unauthorized to delete this blog' });
    }

    // Delete the blog
    await Blog.findByIdAndDelete(blogId);
    return res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a single blog by ID
router.get('/:id', async (req, res) => {
  try {
    const blogId = req.params.id;

    // Find the blog by ID
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    return res.status(200).json(blog);
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
