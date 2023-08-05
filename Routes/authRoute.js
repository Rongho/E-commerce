import express from "express";
import { registerController,loginController,testController,testPassword,updateProfileController,getOrdersController,getAllOrdersController,getAllOrderstatusController } from "../Controller/authController.js";
import { IsAdmin, requireSignIn } from "../Middleware/authMiddleware.js";

const router=express.Router();

// router.post('/register',registerController)
router.route('/register').post(registerController)

router.route('/login').post(loginController)

router.get('/test',requireSignIn,IsAdmin,testController)

router.route('/forgot-password').post(testPassword)

router.get('/user-auth',requireSignIn,(req,res)=>{
res.status(200).send({ok:true})
})

router.get('/admin-auth',requireSignIn,IsAdmin,(req,res)=>{
    res.status(200).send({ok:true})
    })

    router.put('/profile',requireSignIn,updateProfileController)

    router.get('/orders',requireSignIn,getOrdersController)

    router.get('/all-orders',requireSignIn,IsAdmin,getAllOrdersController)

    router.put('/orders-status/:orderId',requireSignIn,IsAdmin,getAllOrderstatusController)

export default router;