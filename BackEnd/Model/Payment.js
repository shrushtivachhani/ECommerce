const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            size: String,
            color: String,
            price: {
                type: Number,
                required: true  // ✅ this causes the validation error if missing
            }
        }
    ],
    total: {
        type: Number,
        required: true
    },
    stripeSessionId: String,
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
