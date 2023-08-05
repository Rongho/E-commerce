import mongoose from "mongoose";
import colors from 'colors';


const Connect=async()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGO_URL)
        console.log(`connected to database server ${conn.connection.host}`.bgMagenta.white);
    } catch (error) {
        console.log(`error in website ${error}`.bgRed.white)
    }
}
export default Connect;