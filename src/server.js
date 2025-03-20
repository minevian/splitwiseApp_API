import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import getOtp from './routes/generateOtp.js';
import verifyOtp from './routes/verifyOtp.js';
import registerUser from './routes/registerUser.js';
import connectDB from './db/config.js';

dotenv.config();
const app = express();
const port = 8080 ;
connectDB();
app.use(express.json()); 
app.use(cors());

app.use('/api',getOtp);
app.use('/api',verifyOtp);
app.use('/api',registerUser)


app.get("/", (req, res) => {
    res.send("Connected to MongoDB Atlas 🚀");
  });

app.listen(port,()=>{
    console.log(`Server is Running in Port: ${port}`);
    
})