import multer from 'multer';
import path from 'path';
import User from '../models/user.js';

const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage });

export const uploadProfilePicture = async (req, res) => {
    const { email } = req.body;

    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    try {
        const user = await User.findOneAndUpdate(
            { email },
            { profilePicture: imageUrl },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Profile picture updated successfully',
            data: user
        });

    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
