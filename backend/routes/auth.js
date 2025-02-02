import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router()
const jwtSecret = process.env.JWT_SECRET;

// to register user

router.post('/register', async (req, res)=>{
    try{
        const {name, email, password, role} = req.body;

        // basic validation of required fields
        if (!name || ! email || !password){
            return res.status(400).json({msg:"Please enter all the required fields"})
        }

        //checking existance of user
        let user = await User.findOne({email})
        if (user) return res.status(400).json({msg:"User already exists"}); 

        // generating salt and hashing password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        // creating new user and saving the user
        user = new User({
            name,
            email,
            password : hash,
            role : role || 'client'
        });
        await user.save()
        res.json({msg : "User registered successfully"})
    }
    catch (err){
        console.error("Error in registering", err)
        res.status(500).json({msg : "Server error"})

    }
});

