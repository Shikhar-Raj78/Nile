const express = require('express')
const router = express.Router()
const {
    registerUser,
    loginUser,
    verifyEmail,
    getUser,
    logoutUser,
    loginStatus,
    forgotPassword,
    resetPassword,
} = require('../controllers/authController');
const protect = require('../middleWare/authMiddleware');

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verifyEmail", verifyEmail);
router.get("/logout", logoutUser);
router.get("/getUser", protect, getUser);
router.get("/loggedin", loginStatus);
router.post("/forgotpassword", forgotPassword);
router.put("/resetPassword/:resetToken", resetPassword);

module.exports = router