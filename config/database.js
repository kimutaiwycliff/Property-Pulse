import mongoose from "mongoose";

let connected = false;

const connectDB = async () => {
    mongoose.set("strictQuery", true);

    //If connected, don't connect again
    if (connected) {
        console.log("Already connected to database");
        return;
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        connected = true;
    } catch (error) {
        console.log(error);
        
    }
}

export default connectDB;
