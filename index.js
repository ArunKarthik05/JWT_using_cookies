const express = require('express');
const cors = require('cors');
const cookies = require('cookie-parser')
const app = express();
const bcryptjs = require("bcryptjs")
const jwt = require('jsonwebtoken');

// const User = require('./database.js')
const User = require('./schema.js');
require('dotenv').config()


const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("JWT AUTH IN NODE JS")
})

app.post("/signup", async (req, res) => {
    const { name, password } = req.body;
    let newUser;
    try {
        const user = await User.findOne({where:{name}})
        console.log(user)
        if (!user) {
            const hashedPassword = await bcryptjs.hash(password, 10); 
            newUser = await User.create({ name, password: hashedPassword }); 
            console.log("Created new user")
        } else {
            return res.status(400).json({ error: 'User already exists' }); 
        }
        return res.status(200).json({ message: 'User created successfully', user: {
            name : newUser.name,
            created : newUser.createdAt
        } });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post("/login",async(req, res) => {
    const { name,password } = req.body;
    const user = await User.findOne({where:{name}})

    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }

    const checkPassword = await bcryptjs.compare( password, user.password);
    if(user && !checkPassword){
        return res.status(401).json({message:"Wrong Password"})
    }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY); 
        const cookieName = name+"token"
        res.cookie (cookieName, token,{
            expires : new Date(Date.now() + 60000),
            maxAge: 60000,
        });
        return res.header('Authorization', `Bearer ${token}`).status(200).json({ message: 'User logged in successfully', user:{
            name : user.name,
            created : user.createdAt
        } });
})

app.listen(PORT,(req, res)=>{
    console.log(`App is running on ${PORT}`);
})