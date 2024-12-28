const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

// Set up Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'versevault', // Folder name in your Cloudinary account
    allowed_formats: ['jpeg', 'png', 'jpg'], // Allow only images
  },
});

// Configure multer
const upload = multer({ storage });

module.exports = upload;
