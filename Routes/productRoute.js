import express from "express";
import { IsAdmin, requireSignIn } from "../Middleware/authMiddleware.js";
import {
  CreateControlProduct,
  getControlProduct,
  getSingleProduct,
  photoProductController,
  deleteProductController,
  UpdateControlProduct,
  fillterProductController,
  countProductController,
  pageProductController,searchProductController,searchSimilarProductController,ProductCategoryController,brainTokenController,brainPaymentController
} from "../Controller/productController.js";
import formidable from "express-formidable";
const route = express.Router();

route.post(
  "/create-product",
  requireSignIn,
  IsAdmin,
  formidable(),
  CreateControlProduct
);

route.get("/get-product", getControlProduct);

route.get("/getsingle-product/:slug", getSingleProduct);

route.get("/photo-product/:pid", photoProductController);

route.delete("/delete-product/:pid", deleteProductController);

route.put(
  "/update-product/:pid",
  requireSignIn,
  IsAdmin,
  formidable(),
  UpdateControlProduct,
);
route.post("/product-filter", fillterProductController);

route.get("/product-count", countProductController);

route.get("/product-list/:page", pageProductController);

route.get("/search/:keyword", searchProductController);

route.get("/similar-product/:pid/:cid", searchSimilarProductController);

route.get("/product-category/:slug", ProductCategoryController);

route.get("/braintree/token",brainTokenController);

route.post("/braintree/payment",requireSignIn,brainPaymentController);
export default route;
