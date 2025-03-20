
export const storedOtp = {};


export const getUserNamefromEmail = (email) => {
    let name = email.split('@')[0]; 
    name = name.replace(/\d+/g, ''); 
    return name.charAt(0).toUpperCase() + name.slice(1); 
};


export const generateOTP = () => {
    const digits = '0123456789';
    const limit = 4;
    let otp = '';
    for (let i = 0; i < limit; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    console.log('Generated OTP:', otp);
    return otp;
};

