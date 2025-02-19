const express = require('express');
const cors = require("cors");
const getOtp = require('./routes/generateOtp.js')
const verifyOtp = require('./routes/verifyOtp.js')
const registerUser = require('./routes/registerUser.js')

const app = express();
const port = 8080;

app.use(express.json()); 
app.use(cors());

app.use('/api',getOtp);
app.use('/api',verifyOtp);
app.use('/api',registerUser)




app.listen(port,()=>{
    console.log(`Server is Running in Port: ${port}`);
    
})