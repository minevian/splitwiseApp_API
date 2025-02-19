const express = require('express');
const router = express.Router();
const {getOtp} = require('../controllers/OtpValidation.controllers.js')


router.post('/getOtp',getOtp);




module.exports = router;
