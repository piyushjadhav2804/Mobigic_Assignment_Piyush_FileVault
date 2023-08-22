//user.js routes

const express = require('express');

const router = express.Router();

const passport = require('passport');

const userController = require('../controllers/users_controller');

// Route to display user profile
router.get('/profile/:id', passport.checkAuthentication, userController.profile);

// Route to render sign in page
router.get("/sign-in", userController.signIn);

// Route to render sign up page
router.get("/sign-up", userController.signUp);

// Route to handle user sign out
router.get("/sign-out", userController.destroySession);

// Route to handle user registration
router.post("/create", userController.create);

// Route to create user session after successful sign in
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'},
), userController.createSession);

// Route to handle file uploads
router.post('/upload/:id', passport.checkAuthentication, userController.upload);

// Route to handle file downloads
router.post('/download/:fileId', passport.checkAuthentication, userController.download);

// Route to handle file deletion
router.get('/delete/:fileId', passport.checkAuthentication, userController.delete);

module.exports = router;