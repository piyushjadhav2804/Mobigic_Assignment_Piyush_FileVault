//index.js routes

//require necessary modules
const express = require("express");
const router = express.Router();

console.log("Express router loaded");

const homeController = require("../controllers/home_controller");

// Define routes using the router
router.get("/", homeController.home);
router.use("/users", require("./users"));

module.exports = router;
