
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const genrateToken=require('../config/genrateToken');


const resgisterUser = asyncHandler(async (req, res) => {
//  console.log(req.body)
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please Enter all the Feilds");

        
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        pic,

    });
    if (user) {
        res.status(201).json({
            _id: user?._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token:genrateToken(user?._id)

        });
    
    } else {
        res.status(400);
        throw new Error("Failed to Create to the User");

    }

    
});

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // console.log('found',user)
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user?._id,
            name: user.name,
            email: user.email,
            token: genrateToken(user?._id),
            pic:user.pic
        });
                    
    } else {
        res.status(400);
        throw new Error("Invalid Email or Password");
        
    }
 });

const allUsers = asyncHandler(async(req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ],
    }
        : {};
    
    const users = await User.find(keyword).find({ _id: { $ne: req.user?._id } });
    res.send(users);
    

 })

module.exports = { allUsers,resgisterUser,authUser };

