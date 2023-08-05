import UserSchema from "../Model/UserSchema.js";
import { hashPassword, Comparepassword } from "../Helper/authHelper.js";
import JWT from "jsonwebtoken";
import Ordermodel from "../Model/Ordermodel.js";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    if (!name) {
      return res.send({ message: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone no is Required" });
    }
    if (!address) {
      return res.send({ message: "Address is Required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is Required" });
    }
    const exisitingUser = await UserSchema.findOne({ email });
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }
    const hashedPassword = await hashPassword(password);
    const user = await new UserSchema({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registeration",
      error,
    });
  }
};
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Email or password is invalid",
      });
    }

    const user = await UserSchema.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "InvaLID USER",
      });
    }
    const match = await Comparepassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "password didn't match",
      });
    }
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "6d",
    });
    res.status(200).send({
      success: true,
      message: "Login Succesfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

export const testController = (req, res) => {
  try {
    res.send("Route is protected");
  } catch (error) {
    console.log(error);
    res.send("error");
  }
};
export const testPassword = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(404).send({ message: "email is required" });
    }
    if (!answer) {
      res.status(404).send({ message: "answer is required" });
    }
    if (!newPassword) {
      res.status(404).send({ message: "newPassword is required" });
    }
    const user = await UserSchema.findOne({ email, answer });

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Wrong email or answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await UserSchema.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password reset succesfully",
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await UserSchema.findById(req.user._id);

    if (password && password.length < 6) {
      return res.json({
        error: "Password is required and it should be 6 character long",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updateUser = await UserSchema.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated succesfully",
      updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};
export const getOrdersController = async (req, res) => {
  try {
    const orders = await Ordermodel.find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({createdAt:"-1"})
      res.json(orders)
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};
export const getAllOrdersController=async(req,res)=>{
  try {
    const orders = await Ordermodel.find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({createdAt:"-1"})
      res.json(orders)
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "Something went wrong",
      error,
    });
}
}
export const getAllOrderstatusController=async(req,res)=>{
  try {
    const { orderId }=req.params
    const {status }=req.body
    const orders=await Ordermodel.findByIdAndUpdate(orderId,{status},{new:true})
    res.json(orders)
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
}