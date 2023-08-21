const express = require('express');
const path = require('path');

const app = express()
const PORT = process.env.PORT | 8000;

app.use(express.static('./assets'));

const expressLayouts = require('express-ejs-layouts');

const db = require('./config/mongoose');

//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport');

const MongoStore = require("connect-mongo");

app.use(express.urlencoded({ extended: false }));

app.use(expressLayouts);
// extract styles & scripts from sub-pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// EJS view engine
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, './views'));

// mongo store is used to store the session cookie in the db
app.use(
  session({
    name: "Mobigic",
    secret: "something",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1/mobigic", // Replace this with your MongoDB connection string
      autoRemove: "disabled",
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use('/', require('./routes'))

app.listen(PORT, (err) => {

    if(err) {
        console.log("Error while running the server");
    }

    console.log(`Express server is up and running on port ${PORT}`);
})