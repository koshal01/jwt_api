const User = require("../models/user");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");

exports.signup = BigPromise(async (req, res, next) => {
    // Get user input 
    const { first_name, last_name, email, password } = req.body;

    // Validate user input
    if (!email || !first_name || !last_name || !password) {
        return next(new CustomError("First_name, last_name, email and password are required", 400));
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
    }

    const user = await User.create({
        first_name,
        last_name,
        email,
        password
    });

    cookieToken(user, res);
});

exports.login = BigPromise(async (req, res, next) => {
    // Get user input
    const {email, password} = req.body;

    //check for presence of email and password
    if(!email || !password){
        return next(new CustomError('Please provide email and password', 400));
    }

    //get user form DB
    const user = await User.findOne({email}).select("+password");

    //if user not found in DB
    if(!user){
        return next(new CustomError('Email or password does not match or exist', 400));
    }

    //match the password
    const isPasswordCorrect = await user.isValidatedPassword(password);

    //if password do not match
    if(!isPasswordCorrect){
        return next(new CustomError('Email or password does not match or exist', 400));
    }

    //if all good then we send token
    cookieToken(user, res);
});

exports.logout = BigPromise(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Logout success"
    });
});

exports.getAllUser = BigPromise(async (req, res, next) => {
    const users = await User.getUsers();

    //if user not found in DB
    if(!user){
        return next(new CustomError('No user exist in the database', 400));
    }

    //users found 
    res.status(200).json({
        success: true,
        users
    })
});