import express  from 'express';
import { IsAdmin, requireSignIn } from '../Middleware/authMiddleware.js';
import { CreateCategoryController,UpdateCategoryController,GetCategoryController,GetsingleCategoryController,DeleteCategoryController } from '../Controller/categoryController.js';

const route=express.Router();

route.post("/create-category",requireSignIn,IsAdmin,CreateCategoryController)

route.put("/update-category/:id",requireSignIn,IsAdmin,UpdateCategoryController)

route.get("/get-category",GetCategoryController)

route.get("/single-category/:slug",GetsingleCategoryController)

route.delete("/delete-category/:id",DeleteCategoryController)

export default route;