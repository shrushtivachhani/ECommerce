// import mongoose from 'mongoose';
const mongoose = require("mongoose");
const express = require('express');

//schema creation
const productSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            trim:true,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        image:{
            type:String,
            required:true
        },
        description:{
            type:String
        },
        brand:{
            type:String
        },
        stock:{
            type:Number
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        sizes: [String],  // Example: ["S", "M", "L", "XL"]
        colors: [String]  // Example: ["red", "blue", "black"]
    }
)

//model creation
const Product = mongoose.model("Product", productSchema);
module.exports = {Product};


