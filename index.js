//index.js

const express = require('express');
const path = require('path');

// Initialize Express app
const app = express()

// Set the port number
const PORT = process.env.PORT | 8000;

// Serve static assets from the 'assets' directory
app.use(express.static('./assets'));

// Include express-ejs-layouts middleware for layout management
const expressLayouts = require('express-ejs-layouts');

// Import the mongoose database connection configuration
const db = require('./config/mongoose');

// Configure and use session handling middleware
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport');
const MongoStore = require("connect-mongo");

// Parse incoming data
app.use(express.urlencoded({ extended: false }));

// Extract styles & scripts from sub-pages into the layout
app.use(expressLayouts);
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// Set up EJS view engine
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, './views'));

// Use MongoDB to store session cookies
app.use(
  session({
    name: "Mobigic", // Name of the session cookie
    secret: "something", // Secret key for encrypting the session
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100, // Session duration in milliseconds
    },
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1/mobigic", // Replace this with your MongoDB connection string
      autoRemove: "disabled", // Option to disable automatic session removal
    }),
  })
);

// Initialize Passport for user authentication
app.use(passport.initialize());
app.use(passport.session());

// Middleware to set the authenticated user in locals for EJS templates
app.use(passport.setAuthenticatedUser);

// Include routes from the 'routes' module
app.use('/', require('./routes'))

// Start the server
app.listen(PORT, (err) => {

    if(err) {
        console.log("Error while running the server");
    }

    console.log(`Express server is up and running on port ${PORT}`);
})