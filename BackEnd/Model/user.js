// import mongoose from 'mongoose';
const mongoose = require("mongoose")

//schema creation
const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            trim:true,
            required:true
        },
        email:{
            type:String,
            trim:true,
            required:true,
            unique:true
        },
        password:{
            type:String,
            trim:true,
            required:true,
            minlength:8
        },
        role:{
            type:String,
            enum:['admin', 'user'],
            default:'user'
        },
        token:{
            type:String,
            default: null,
            required: true
        }
    }
)

//model creation
module.exports = mongoose.model('User', userSchema);