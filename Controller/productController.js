import ProductModel from "../Model/ProductModel.js";
import fs from 'fs'
import slugify from "slugify";
import CategoryModel from "../Model/CategoryModel.js";
import Ordermodel from "../Model/Ordermodel.js";
import dotenv from 'dotenv';
import braintree from "braintree";

dotenv.config();

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});


export const CreateControlProduct=async(req,res)=>{
  try {   
    const { name,slug,description,price,category,quantity,shipping }=req.fields;
    const {photo}=req.files;
    switch(true){
        case !name:
          return res.status(500).send({error:"name is required"})
          case !price:
          return res.status(500).send({error:"price is required"}) 
          case !description:
          return res.status(500).send({error:"description is required"}) 
          case !category:
          return res.status(500).send({error:"category is required"}) 
          case !quantity:
          return res.status(500).send({error:"quantity is required"}) 
          case photo && photo.size>1000000:
          return res.status(500).send({error:"photo is required size of photo should be less than 1mb"}) 
    }
          const products=new ProductModel({...req.fields,slug:slugify(name)});
          if(photo){
            products.photo.data=fs.readFileSync(photo.path);
            products.photo.contentType=photo.type;
          }
          await products.save();
          res.status(201).send({
            success:true,
            message:"product created succesfully",
            products,
          })
    
  } catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:"error in create product",
        error
    })
  }
}

export const getControlProduct=async(req,res)=>{
  try {
    const products=await ProductModel.find({}).populate("category").select("-photo").limit(12).sort({createdAt:-1});
    await products.popu
    res.status(200).send({
      count:products.length,
      success:true,
      message:"succesful in getting product",
      products,
        })
  } catch (error) {
   console.log(res)
   res.status(500).send({
    success:false,
        message:"error in getting product",
        error
   })
  }
}

export const getSingleProduct=async(req,res)=>{
  try {
    const product=await ProductModel.findOne({slug:req.params.slug}).select("-photo").populate("category");
    res.status(200).send({
      success:true,
      message:"succesful in getting single product",
      product,
    })
  } catch (error) {
    console.log(res)
    res.status(500).send({
     success:false,
         message:"error in getting single product",
         error
    })
  }
}
export const photoProductController=async(req,res)=>{
   try {
    const product=await ProductModel.findById(req.params.pid).select("photo");
    if(product.photo.data){
      res.set("Content-type",product.photo.contentType)
      res.status(200).send(product.photo.data)
    }
   } catch (error) {
    console.log(res)
    res.status(500).send({
     success:false,
         message:"error in getting photos of product",
         error
    })
   }
}

export const deleteProductController=async(req,res)=>{
  try {
    await ProductModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
     success:true,
     message:"deleted succesfully" 
    })
  } catch (error) {
    console.log(res)
    res.status(500).send({
     success:false,
         message:"error in getting photos of product",
         error
    })
  }
}
export const UpdateControlProduct=async(req,res)=>{
  try {   
    const { name,slug,description,price,category,quantity,shipping }=req.fields;
    const {photo}=req.files;
    switch(true){
        case !name:
          return res.status(500).send({error:"name is required"})
          case !price:
          return res.status(500).send({error:"price is required"}) 
          case !description:
          return res.status(500).send({error:"description is required"}) 
          case !category:
          return res.status(500).send({error:"category is required"}) 
          case !quantity:
          return res.status(500).send({error:"quantity is required"}) 
          case photo && photo.size>1000000:
          return res.status(500).send({error:"photo is required size of photo should be less than 1mb"}) 
    }
          const products=await ProductModel.findByIdAndUpdate(req.params.pid,{...req.fields,slug:slugify(name)},{new:true});
          if(photo){
            products.photo.data=fs.readFileSync(photo.path);
            products.photo.contentType=photo.type;
          }
          await products.save();
          res.status(201).send({
            success:true,
            message:"product updated succesfully",
            products,
          })
    
  } catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:"error in updating product",
        error
    })
  }
}

export const fillterProductController=async(req,res)=>{
try {
  const{checked,radio}=req.body;
  let barc={};
  if(checked.length>0) barc.category=checked;
  if(radio.length>0) barc.price={ $gte: radio[0] , $lte: radio[1]}
  const product=await ProductModel.find(barc);
  res.status(201).send({
    success:true,
    message:"product updated succesfully",
    product,
  })
} catch (error) {
  console.log(error)
  res.status(500).send({
      success:false,
      message:"error in filtering product for radius and check",
      error
  })
}
}
export const countProductController=async(req, res)=>{
try {
  const count= await ProductModel.find({}).estimatedDocumentCount();
  res.status(201).send({
    success:true,
    message:"product count updated succesfully",
    count,
  })
} catch (error) {
  res.status(500).send({
    success:false,
    message:"error in counting product",
    error
})
}
}
export const pageProductController=async(req,res)=>{
try {
  const perPage=3;
  const page=req.params.page?req.params.page:1;
  const products=await ProductModel.find({}).select("-photo").skip((page-1)*perPage).limit(perPage).sort({createdAt:-1})
  res.status(201).send({
    success:true,
    message:"page list updated succesfully",
    products,
  })
} catch (error) {
  res.status(500).send({
    success:false,
    message:"error in filtering pages of product",
    error
})
}
}
export const searchProductController=async(req,res)=>{
  try {
    const {keyword}=req.params;
    const result=await ProductModel.find({$or:[
      {name: { $regex:keyword, $options:"i"}},
      {description:{ $regex:keyword, $options:"i"}},
    ]}).select("-photo");
res.json(result)
  } catch (error) {
    res.status(500).send({
      success:false,
      message:"error in filtering search product",
      error
    })
  }
}
export const searchSimilarProductController=async(req,res)=>{
  try {
    const {pid,cid}=req.params
    const products= await ProductModel.find({
      category:cid,
      _id:{$ne:pid}
    }).select("-photo").limit(3).populate("category")
    res.status(200).send({
      success:true,
      products,
    })
  } catch (error) {
    res.status(500).send({
      success:false,
      message:"error in filtering product",
      error
    })
  }
}
export const ProductCategoryController=async(req,res)=>{
  try {
    const category=await CategoryModel.findOne({slug:req.params.slug});
    const products= await ProductModel.find({category}).populate('category');
    res.status(200).send({
      success:true,
      category,
      products,
    })
  } catch (error) {
    res.status(500).send({
      success:false,
      message:"error in filtering product",
      error
    })
  }
}
export const brainTokenController=async(req,res)=>{
try {
  gateway.clientToken.generate({},function(err,response){
    if(err){
      res.status(500).send(err)
    }else{
      res.send(response);
    }
  })
} catch (error) {
  console.log(error)
}
}

export const brainPaymentController=async(req,res)=>{
  try {
    const {cart,nonce}=req.body;
    let total=0;
    cart.map((i)=>{
      total=total+i.price;
    });
    let newTransaction = gateway.transaction.sale({
      amount:total,
      paymentMethodNonce:nonce,
      options:{
        submitForSettlement:true
      },
    },
    function(error,result){
      if(result){
        const order= new Ordermodel({
          products:cart,
          payment:result,
          buyer:req.user._id,
        }).save()
        res.json({ok:true})
      }else{
        res.status(500).send(error)
      }
    }
    )
  } catch (error) {
    console.log(error)
  }
  }
