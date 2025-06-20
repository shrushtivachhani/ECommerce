const mongoose = requrie('mongoose');

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
            required:true
        },
    }
)