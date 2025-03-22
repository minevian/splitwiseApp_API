import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import getOtp from './routes/generateOtp.js';
import verifyOtp from './routes/verifyOtp.js';
import registerUser from './routes/registerUser.js';
import getUserDetails from './routes/registerUser.js'
import connectDB from './db/config.js';
import loginUser from './routes/LoginUser.js';
import profilePicture from './routes/profileImage.routes.js';
import createGroup from './routes/GroupActivities.js';
import getGroups from './routes/GroupActivities.js';
import getGroupById from './routes/GroupActivities.js'



dotenv.config();
const app = express();
const port = 8080 ;
connectDB();
app.use(express.json()); 
const corsOptions = {
  origin: ['http://localhost:8081', 'http://127.0.0.1:8081','http://localhost:5413'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.use('/api',getOtp);
app.use('/api',verifyOtp);
app.use('/api',registerUser)
app.use('/api',getUserDetails);
app.use('/api',loginUser);
app.use('/api',profilePicture);
app.use('/api',createGroup)
app.use('/api',getGroups);
app.use('/api',getGroupById);



app.get("/", (req, res) => {
    res.send("Connected to MongoDB Atlas 🚀");
  });

app.listen(port,()=>{
    console.log(`Server is Running in Port: ${port}`);
    
})