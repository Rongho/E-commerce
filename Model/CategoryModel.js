import mongoose from "mongoose";

const CategorySchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    slug:{
        type:String,
        lowercase:true,
    }
})
export default mongoose.model("category",CategorySchema);