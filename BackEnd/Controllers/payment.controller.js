require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Product } = require('../Model/Product');
const Cart = require('../Model/Cart');
const Payment = require('../Model/Payment');
const jwt = require('jsonwebtoken');
const sendEmail = require('../Utils/userEmail');

const createPaymentSession = async (req, res) => {
    try {
        // 1. Verify JWT token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token missing or malformed' });
        }

        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, "supersecret"); // secret should ideally be from env
        const userId = decodedToken.userId;
        const userEmail = decodedToken.email;

        // 2. Get cart for the user
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // 3. Get product details from DB
        const productIds = cart.products.map(p => p.productId);
        const products = await Product.find({ _id: { $in: productIds } });

        // 4. Build Stripe line items
        const lineItems = [];

        for (const item of cart.products) {
            const product = products.find(p => p._id.toString() === item.productId.toString());

            if (!product) {
                return res.status(400).json({ message: `Product ${item.productId} not found` });
            }

            if (item.quantity > product.stock) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }

            lineItems.push({
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: `${product.name} (${item.size || 'Free Size'}, ${item.color || 'Default'})`,
                        description: product.description || '',
                    },
                    unit_amount: Math.round(product.price * 100), // amount in paisa
                },
                quantity: item.quantity
            });
        }

        // 5. Create Stripe session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/payment-cancelled`,
            metadata: { userId }
        });

        // 6. Save payment in DB
        await Payment.create({
            userId,
            products: cart.products.map(p => {
                const matchedProduct = products.find(prod =>
                    prod._id.toString() === p.productId.toString()
                );
                return {
                    productId: p.productId,
                    quantity: p.quantity,
                    size: p.size,
                    color: p.color,
                    price: matchedProduct?.price ?? 0
                };
            }),
            total: products.reduce((sum, product) => {
                const item = cart.products.find(i => i.productId.toString() === product._id.toString());
                return sum + (product.price * (item?.quantity ?? 1));
            }, 0),
            stripeSessionId: session.id,
            paymentStatus: 'pending',
        });

        // 7. Send confirmation email
        await sendEmail(userEmail, products.map(product => {
            const item = cart.products.find(p => p.productId.toString() === product._id.toString());
            return {
                name: product.name,
                price: product.price,
                quantity: item?.quantity ?? 1
            };
        }));

        // 8. Send response
        res.json({ url: session.url });
    } catch (error) {
        console.error('Payment session creation error:', error);
        res.status(500).json({ message: 'Failed to create payment session' });
    }
};

module.exports = {
    createPaymentSession
};
