import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB=async()=>{
    try {
    const connectionInstance =await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    console.log(`mongodb connected : ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("monogdb connection error", error);
        process.exit(1);   //nodejs give eccess to process exit which is ongoing from above
        //now no need to throw error here

    }
}
export default connectDB;