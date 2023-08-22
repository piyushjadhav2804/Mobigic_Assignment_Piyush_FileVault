// passport.js

//require passport-local strategy
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

//require User model
const User = require("../model/user");

// Set up authentication using Passport Local Strategy
passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },

    async (req, email, password, done) => {
      try {
        const user = await User.findOne({ email: email });

        // if user is not found or entered passwords doesn't matched
        if (!user || user.password !== password) {
          console.log("Invalid Username/Password");
          return done(null, false, { message: "Invalid email or password" });
        }

        //authenticated user
        return done(null, user);
      } catch (err) {
        req.flash("error", err);
        return done(err);
      }
    }
  )
);

// Serialize the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// Deserialize the user from the key in the cookies
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    return done(null, user);
  } catch (err) {
    console.log("Error finding user. Try again");
    return done(err);
  }
});

// Check if user is authenticated
passport.checkAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect("/users/sign-in");
};

// Set authenticated user details in res.locals for view templates
passport.setAuthenticatedUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }

  next();
};

module.exports = passport;
