import User from '../models/user.js';
import bcrypt from 'bcryptjs';

export const registerUser = async (req, res) => {
    const { userName, phoneNumber, email, password, confirmPassword } = req.body;

    if (!userName || !phoneNumber || !email || !password || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Please fill in all fields'
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Passwords do not match'
        });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email address already exists'
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            userName,
            phoneNumber,
            email,
            password: hashedPassword,
            confirmPassword: hashedPassword
        });

        // Save the user to MongoDB
        await newUser.save();

        res.status(201).json({
            success: true,
            message: 'Registered successfully',
            data: {
                email: newUser.email,
                name: newUser.userName
            }
        });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};


export const getRegisterUser = async (req, res) => {
    const { email } = req.body; 

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email is required'
        });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                userName: user.userName,
                phoneNumber: user.phoneNumber,
                email: user.email,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
