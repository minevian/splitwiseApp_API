import express from 'express';
import multer from 'multer';
import { uploadProfilePicture } from '../controllers/profileImage.controller.js';

const router = express.Router();

// Store image in memory (no local file storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/uploadprofile', upload.single('image'), uploadProfilePicture);

export default router;
