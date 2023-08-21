const express = require('express');

const router = express.Router();

const passport = require('passport');

const userController = require('../controllers/users_controller');


router.get('/profile/:id', passport.checkAuthentication, userController.profile);
router.get("/sign-in", userController.signIn);
router.get("/sign-up", userController.signUp);
router.get("/sign-out", userController.destroySession);

router.post("/create", userController.create);

//use passport as middleware for authentication
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'},
), userController.createSession);

router.post('/upload/:id', passport.checkAuthentication, userController.upload);

router.post('/download/:fileId', passport.checkAuthentication, userController.download);

router.get('/delete/:fileId', passport.checkAuthentication, userController.delete);

module.exports = router;