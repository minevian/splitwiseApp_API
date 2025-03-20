
import mongoose from 'mongoose';
import dotenv from 'dotenv';


dotenv.config();

const connectDB = () => {
  try {
    const ConnectionDB = 'mongodb+srv://mineVianSplitApps:mineVian123@splitapp-db.ve48y.mongodb.net/?retryWrites=true&w=majority&appName=splitApp-DB'

    mongoose.connect(ConnectionDB);
    console.log("MongoDB Atlas connected successfully ");
  } catch (error) {
    console.error("MongoDB Atlas connection failed", error.message);
    process.exit(1);
  }
};


export default connectDB;
