// mongoose.js

// require mongoose module
const mongoose = require("mongoose");

// Connect to MongoDB using the provided URI
mongoose.connect(process.env.MONGO_URL);

// Get a reference to the database connection
const db = mongoose.connection;

// Listen for connection errors and log them
db.on("error", console.error.bind(console, "Error connecting to MongoDB"));

// Once the connection is open, log a success message
db.once("open", function () {
  console.log("Connected to Database :: MongoDB");
});

// Export the database connection to be used in other parts of the application
module.exports = db;
