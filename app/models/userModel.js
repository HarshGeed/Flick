import mongoose from "mongoose";
import validator from 'validator';

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please provide us your name'],
    },
    email:{
        type: String,
        required: [true, 'Please provide your email id'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    }
})

const User = mongoose.model('User', userSchema);
module.exports = User;