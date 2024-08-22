const express = require("express");
const router = new express.Router();
const controllers = require("../controllers/userControllers");


// Routes
router.post("/register",controllers.userRegister);
router.post("/login",controllers.userLogin);
router.post("/setpassword",controllers.userSetPassword);
router.get("/verification/:token",controllers.userEmailVerify);

module.exports = router;