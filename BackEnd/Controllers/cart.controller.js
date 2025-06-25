const { Product } = require('../Model/Product');
const { User } = require('../Model/User');
const Cart = require('../Model/Cart');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//add to cart
const addToCart = async (req, res) => {
    try {
        const id = req.params.id;
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token missing or malformed' });
        }
        const token = req.headers.authorization?.split(" ")[1];
        console.log(token);
        const decodedToken = jwt.verify(token, "supersecret");
        console.log(decodedToken);

        const userId = decodedToken.userId;
        console.log(userId);

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const cart = await Cart.findOne({ userId: userId });
        console.log(cart);

        if (!cart) {
            const newCart = new Cart({ userId: userId, products: [{ productId: id, quantity: 1 }] });
            await newCart.save();
        }
        return res.status(200).json({ message: 'Product added to cart successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { addToCart };