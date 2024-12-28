const express = require('express');
const bcrypt = require('bcrypt');
const authenticateToken = require('../middlewares/auth');
const User = require('../models/User');

const router = express.Router();

router.put('/', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id; // Extract the logged-in user's ID from the token
      const { username, email, password } = req.body;
  
      // Validate input
      if (!username && !email && !password) {
        return res.status(400).json({ message: 'Nothing to update' });
      }
  
      // Find the user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update fields if provided
      if (username) user.username = username;
      if (email) user.email = email;
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }
  
      const updatedUser = await user.save();
      return res.status(200).json({
        message: 'User updated successfully',
        user: {
          id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
        },
      });
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

router.delete('/', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id; // Extract the logged-in user's ID from the token
  
      // Find the user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Delete the user
      await User.findByIdAndDelete(userId);
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
    
  
module.exports = router;