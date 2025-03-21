import cloudinary from '../db/cloudinaryConfig.js';
import streamifier from 'streamifier';
import User from '../models/user.js';

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'profile_pictures' },  // Folder in Cloudinary
            (error, result) => {
                if (error) {
                    console.error('Cloudinary Upload Error:', error);
                    return reject(error);
                }
                resolve(result);
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
};

export const uploadProfilePicture = async (req, res) => {
    const { email } = req.body;

    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    try {
        // Upload buffer directly to Cloudinary
        const result = await uploadToCloudinary(req.file.buffer);

        const imageUrl = result.secure_url;

        // Store image URL in MongoDB
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
            message: 'Profile picture uploaded successfully',
            data: {
                imageUrl: user.profilePicture
            }
        });

    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
