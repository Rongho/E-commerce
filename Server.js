import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import Connect from './Config/db.js';
import authRoutes from './Routes/authRoute.js'
import cors from 'cors'
import categoryRoute from './Routes/categoryRoute.js'
import productRoute from './Routes/productRoute.js'
import path from 'path'
import { fileURLToPath } from 'url';



dotenv.config();

Connect();

const __filename =fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app=express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/category",categoryRoute);
app.use("/api/v1/product",productRoute);
app.use(express.static(path.join(__dirname , './client/build')))





// app.get("/", (req, res) => {
//   res.send("<h1>Welcome to ecommerce app</h1>");
// });

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname,'./client/build/index.html'))
});


const port=process.env.PORT || 8000;

app.listen(port,()=>{
    console.log(`Server is running on ${process.env.DEVLOP} mode on ${port} port`.bgCyan.white)
})


