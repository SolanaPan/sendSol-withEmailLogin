require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
dotenv = require('dotenv');
dotenv.config();
require("./db/conn");
const router = require("./Routes/router");
 
// middleware
app.use(express.json());
app.use(cors());
app.use('/api/users', router);


const port = process.env.PORT || 5000;
app.listen(process.env.PORT,()=>{
    console.log(`Server start at Port No :${process.env.PORT}`)
})

