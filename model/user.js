// User.js Schema

//require necessary modules
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

// Define the path where uploaded files will be stored
const FILE_PATH = path.join('/uploads/users/files');

// Define the user schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    }, 

    name: {
        type: String,
        required: true
    },

    //array of files
    file: [
      {
        fileId: String, //unique 6 digit code
        fileName: String,
        filePath: String
      }
    ]
}, {
    timestamps: true
});

// Define the multer storage configuration
let storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', FILE_PATH));
  },

  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  },
});

// Define static methods for the user schema
userSchema.statics.uploadedFile = multer({storage: storage}).single('file');
userSchema.statics.filePath = FILE_PATH; 

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;