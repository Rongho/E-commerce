import slugify from "slugify";
import CategoryModel from "../Model/CategoryModel.js";

export const CreateCategoryController=async(req,res)=>{

    try {
        const{name}=req.body;
        if(!name){
            return res.status(404).send({message:"name is required"})
        }
        const existingCategory=await CategoryModel.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success:true,
                message:"category already exist"
            })
        }
        const category=await new CategoryModel({name, slug:slugify(name)}).save()
        res.status(200).send({
            success:true,
            message:"new category created",
            category 
        })
    } catch (error) {
     console.log(error);
     res.status(500).send({
        success:false,
        error,
        message:"Error in Category"
     })        
    }
}
export const UpdateCategoryController=async(req,res)=>{
    try {
        const{name}=req.body;
    const{id}=req.params;
    const category=await CategoryModel.findByIdAndUpdate(id,{
        name,slug:slugify(name)},
        {new:true}
        )
        res.status(200).send({
            success:true,
            message:"category updated succesfully",
            category 
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
           success:false,
           error,
           message:"Error in updating Category"
    })
}

}
export const GetCategoryController=async(req,res)=>{
try {
    const category=await CategoryModel.find({})
    res.status(200).send({
        success:true,
            message:"All category List",
            category,
    })
} catch (error) {
    console.log(error);
        res.status(500).send({
           success:false,
           error,
           message:"Error in getting Category"
    })
}
}

export const GetsingleCategoryController=async(req,res)=>{
    try {
        const category=await CategoryModel.findOne({slug:req.params.slug})
        res.status(200).send({
            success:true,
                message:"single category is got",
                category,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
           success:false,
           error,
           message:"Error in getting single Category"
    }) 
    }
}

export const DeleteCategoryController=async(req,res)=>{
  try {
    const {id}=req.params;
    await CategoryModel.findByIdAndDelete(id) 
    res.status(200).send({
        success:true,
        message:"file is deleted",
    })
  } catch (error) {
    console.log(error);
        res.status(500).send({
           success:false,
           error,
           message:"Error in deleting single Category"
        }) 
  }
}