const express = require("express");
const app = express();
const port = 8080;
const connectDB = require('./DB/connectDB');
const cors = require("cors");
const morgan = require("morgan");
const routes = require('./routes');
// const userRoutes = require('./routes/user.route');
// const productRoutes =require('./routes/product.route');

//middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(routes);

// app.use('/user', userRoutes);
// app.use('/product', productRoutes);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})