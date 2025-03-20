import express from 'express';
import { registerUser,getRegisterUser } from '../controllers/registerUser.controller.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/getUserGetails',getRegisterUser)

export default router;
