import express from 'express';
import { uploadProfilePicture } from '../controllers/profileImage.controller.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/uploadprofile', upload.single('image'), uploadProfilePicture);


export default router;
