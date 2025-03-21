import bcrypt from 'bcryptjs';
import User from '../models/user.js';

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }

    try {
        // Check if the user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Compare the entered password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Successful login
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                userId: user._id,
                email: user.email,
                userName: user.userName
            }
        });

    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
