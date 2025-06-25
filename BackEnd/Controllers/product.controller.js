const { Product } = require('../Model/Product');
const { User } = require('../Model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const product = async (req, res) => {
    try {
        const products = await Product.find({});
        return res.status(200).json({
            message: 'Products retrieved successfully',
            products: products
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const addProduct = async (req, res) => {
    try {
        const { name, image, brand, stock, price, description } = req.body;

        // const { token } = req.headers;
        // const decodedToken = jwt.verify(token, "supersecret");
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token missing or malformed' });
        }
        const token = req.headers.authorization?.split(" ")[1];
        console.log(token);
        const decodedToken = jwt.verify(token, "supersecret");

        // const user = await User.findOne({ email: decodedToken.email });
        const product = await Product.create({
            name,
            price,
            image,
            description,
            stock,
            brand,
            user: token.userId
        })
        return res.status(200).json({
            message: 'Product added successfully',
            product: product
        })
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: 'Invalid request',
            error: err
        })
    }
}

const getProductById = async(req, res)=>{
    try{
        const id = req.params.id;
        const product = await Product.findById(id);
        if(!product){
            return res.status(404).json({message: 'Product not found'});
        }
        return res.status(200).json({product});
    } catch(err){
        console.log(err);
        res.status(500).json({message:"internal server error"});
    }
}

module.exports = { product, addProduct, getProductById};