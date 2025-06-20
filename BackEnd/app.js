const express = require("express");
const app = express();
const port = 8080;
const connectedDB = require("./DB/connectDB");

connectedDB();

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})