import mongoose from "mongoose";

export const connectDB = async() =>{
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        console.log("Lien ket CSDL thanh cong");
    } catch (error) {
        console.error("Loi ket noi CSD:",error);
        process.exit(1);
    }
}