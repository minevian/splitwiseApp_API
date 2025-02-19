const { generateOTP, getUserNamefromEmail,  storedOtp } = require('../utils/otpUtils');
const nodemailer = require('nodemailer');


 const getOtp =  (req, res) => {
    console.log('Received POST request to send OTP');
    
    const email = req.body.email;
    const name = getUserNamefromEmail(email);
    const otp = generateOTP();

    sendEmail(email, otp, 'Splitwise | OTP Verification', 
        `<p>Dear ${name},</p>
        <p>Thank you for using SplitzApp</p>
        <p>Please enter the OTP <strong>${otp}</strong> to verify your email address.</p>
        <br/>
        <p>Best regards,<br/>SplitzApp Team</p>`
    );

    storedOtp[email] = otp;
    res.status(200).json({ 
        success:true,
        message: 'OTP sent successfully',
        data:{
            otp:otp
        }
    
    }
    
    );
}
const sendEmail = async (email, otp, subject, html) => {
    console.log('Generated OTP:', otp);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mineviandev@gmail.com', 
            pass: 'ziak ferw emao cjll'
        }
    });

    const mailOptions = {
        from: 'mineviandev@gmail.com',
        to: email,
        subject: subject,
        html: html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error(error);
    }
};

 const verifyOtp = (req, res) => {
    const { email, otp } = req.body;

    if (!storedOtp[email]) {
        return res.status(400).json({
            sucess:false,
            error: 'OTP expired or not requested' });
    }

    if (storedOtp[email] === otp) {
        delete storedOtp[email]; 
        return res.status(200).json({ 
            success:true,
            message: 'OTP verified successfully' });
    } else {
        return res.status(400).json({ 
            sucess:false,
            error: 'Invalid OTP' });
    }
}

module.exports = {getOtp,verifyOtp}