const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const FILE_PATH = path.join('/uploads/users/files');

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

let storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', FILE_PATH));
  },

  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  },
});

//static methods
userSchema.statics.uploadedFile = multer({storage: storage}).single('file');
userSchema.statics.filePath = FILE_PATH; 

const User = mongoose.model('User', userSchema);

module.exports = User;