const express = require('express');
const router = express.Router();
const {verifyOtp} = require('../controllers/OtpValidation.controllers.js')

router.post('/verifyOtp',verifyOtp);

module.exports = router;
