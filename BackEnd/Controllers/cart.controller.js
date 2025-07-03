const { Product } = require('../Model/Product');
const { User } = require('../Model/User');
const Cart = require('../Model/Cart');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// add to cart
const addToCart = async (req, res) => {
    try {
        // get product id from request parameters
        const {id, quantity, size, color} = req.body;
        
        // check for authorization header and format
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token missing or malformed' });
        }

        // extract and verify token
        const token = req.headers.authorization?.split(" ")[1];
        //console.log(token); // debug log

        const decodedToken = jwt.verify(token, "supersecret");
        //console.log(decodedToken); // debug log

        const userId = decodedToken.userId;
        console.log(userId); // debug log

        // check if product exists
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // find existing cart of user
        let cart = await Cart.findOne({ userId: userId });
        console.log(cart); // debug log

        // if cart does not exist, create a new one with the product
        if (!cart) {
            cart = new Cart({ userId: userId, products: [{ productId: id, quantity: quantity, size: size, color: color }] });
        }
        else {
            // check if the product is already in the cart
            const productInCart = cart.products.find((product) => {
                return product.productId == id;
            });
            console.log(productInCart);
            

            // if product exists in cart, increase quantity
            if (productInCart) {
                productInCart.quantity += 1;
            }
            // else, add new product with quantity 1
            else {
                cart.products.push({ productId: id, quantity: 1 });
            }
        }

        // save updated cart
        await cart.save();

        // send response
        return res.status(200).json({ message: 'Product added to cart successfully', cart });
    } catch (err) {
        // handle unexpected errors
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}


//delete from cart
const deleteFromCart = async (req, res) => {
    try {
        // get product id from URL params
        const productId = req.params.id;

        // verify token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token missing or malformed' });
        }

        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, "supersecret");
        const userId = decodedToken.userId;

        // find the user's cart
        const cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // check if product exists in cart
        const productIndex = cart.products.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        // remove the product from cart
        cart.products.splice(productIndex, 1);

        // save the updated cart
        await cart.save();

        return res.status(200).json({ message: 'Product removed from cart successfully', cart });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// update cart (increase, decrease, change size/color)
const updateCart = async (req, res) => {
    try {
        const { productId, action, size, color } = req.body;

        // verify token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token missing or malformed' });
        }

        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, "supersecret");
        const userId = decodedToken.userId;

        // find cart
        const cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // find the product in the cart
        const productInCart = cart.products.find(
            (item) => item.productId.toString() === productId
        );

        if (!productInCart) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        // handle quantity action
        if (action === 'increase') {
            productInCart.quantity += 1;
        } else if (action === 'decrease') {
            if (productInCart.quantity > 1) {
                productInCart.quantity -= 1;
            } else {
                return res.status(400).json({ message: 'Minimum quantity is 1' });
            }
        }

        // update size and color if provided
        if (size) productInCart.size = size;
        if (color) productInCart.color = color;

        await cart.save();

        return res.status(200).json({ message: 'Cart updated successfully', cart });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = { addToCart, deleteFromCart, updateCart };