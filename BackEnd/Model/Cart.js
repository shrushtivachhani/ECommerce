// import mongoose from 'mongoose';
const mongoose = require("mongoose")

//schema creation
const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product'
                },
                quantity: {
                    type: Number,
                    required: true
                },
                size: {
                    type: String,
                    default: null
                },
                color: {
                    type: String,
                    default: null
                }
            }
        ]
    }
)

//model creation
module.exports = mongoose.model('Cart', cartSchema);