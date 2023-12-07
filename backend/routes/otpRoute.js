const express = require('express');
const {sendOTP} = require('../controllers/otpController');
const router = express.Router();
router.post('/send-otp', sendOTP);
module.exports = router;