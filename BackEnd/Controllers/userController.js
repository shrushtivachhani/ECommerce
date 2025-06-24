const User = require('../Model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//signup route
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //field check
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        //user mail check
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        //hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //const hashedPassword = await bcrypt.hash(password, 10);
        // const user = new User({ name, email, password: hashedPassword });
        // await user.save();

        //jwt token
        const token = await jwt.sign({ email }, "supersecret", {
            expiresIn: '1h'
        });

        //create user in database
        const userData = await User.create({
            name,
            email,
            password: hashedPassword,
            token,
        });

        // res.status(200).json({ token });
        res.status(201).json({ message: "User created successfully", user: userData });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Error creating user" });
    }
}

//login route
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        //check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        //compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }
        //jwt token
        const token = jwt.sign({ userId: user._id }, "supersecret",
            {
                expiresIn: '1h'
            }
        );
        // res.status(200).json({ token });
        res.status(200).json({ message: "User logged in successfully", token, user:{
            id: user.id,
            name: user.name,
            email: user.email
        } });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error logging in user" });
    }
}

module.exports = { signup, login};