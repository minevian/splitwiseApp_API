import express from 'express';
import { getOtp } from '../controllers/OtpValidation.controllers.js';

const router = express.Router();

router.post('/getOtp', getOtp);

export default router;
