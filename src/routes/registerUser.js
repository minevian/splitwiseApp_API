const express = require('express');
 const {registerUser} = require('../controllers/registerUser.controller.js')
const router = express.Router();

router.post('/register',registerUser );

module.exports = router;
