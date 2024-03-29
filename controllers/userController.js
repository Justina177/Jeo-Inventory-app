const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"})
}
// Register User
const registerUser = asyncHandler(async(req, res) => {
    const {name, email, password} = req.body

    // Validation
    if (!name || !email || !password) {
        res.status(400)
        throw new Error("please fill in all required fields")
    }

    if (password.length < 6) {
        res.status(400)
        throw new Error ("password must be up to 6 characters")
    }

    // check if user email already exists
    const userExits = await User.findOne({ email });

    if (userExits) {
        res.status(400);
        throw new Error("Email has already been registered")
    }

    //  create new user
    const user = await User.create({
        name,
        email,
        password
    });

    //  Generate Token
    const token = generateToken(user._id);

    //  Send HTTP-only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true
    })

    if (user) {
        const { _id, name, email, photo, phone, bio } = user ;
        res.status(201).json({
            _id, 
            name, 
            email, 
            photo, 
            phone, 
            bio,
            token
        });
    } else {
        res.status(400)
        throw new Error("Invalid user data")
    } 
});

// Login User
const loginUser = asyncHandler( async (req, res) => {
    // res.send("Login User") 
    const { email, password }= req.body

    // Validate Request 
    if (!email || !password) {
        res.status(400);
        throw new Error("Please add email and password");
    }

    //  Check if User Exists
    const user = await User.findOne({email})

    if (!user) {
        res.status(400);
        throw new Error("User not found, please signup");
    }

    // User exits, Check if password is correct
    const passwordIsCorrect = await bcrypt.compare (password, user.password);

    //  Generate Token
    const token = generateToken(user._id);

    //  Send HTTP-only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true
    })

    if (user && passwordIsCorrect) {
        const { _id, name, email, photo, phone, bio } = user ;
        res.status(200).json({
            _id, 
            name, 
            email, 
            photo, 
            phone, 
            bio,
            token
        });
    } else {
        res.status(400);
        throw new Error("Invalid email or password");
    }
});

//  Logout User
const logout = asyncHandler( async (req, res) => {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0), // 1 day
        sameSite: "none",
        secure: true
    });
    return res.status(200).json({ message: "successfully Logout"})
    
});

// Get User Data
const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        const { _id, name, email, photo, phone, bio } = user;
        res.status(200).json({
            _id, 
            name, 
            email, 
            photo, 
            phone, 
            bio,     
        });
    } else {
        res.status(400)
        throw new Error("User Not Found")
    } 
});

//  Get Login Status
const loginStatus = asyncHandler (async (req, res) => {
    
    const token = req.cookies.token;
    if (!token) {
        return res.json(false)
    }

    //  Verify Token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified) {
        return res.json(true);
    }
        return res.json(false);
});

//  Update User
const updateUser = asyncHandler (async (req, res) => {
    // res.send("User updated")
    const user = await User.findById(req.user._id)

    if (user) {
        const { name, email, photo, phone, bio } = user;
        user.email = email;
        user.name = req.body.name || name;
        user.phone = req.body.phone || phone;
        user.bio = req.body.bio || bio;
        user.photo = req.body.photo || photo;

        const updatedUser = await user.save()
        res.status(200).json({ 
            name: updatedUser.name, 
            email: updatedUser.email,
            photo: updatedUser.photo,
            phone: updatedUser.phone,
            bio: updatedUser.bio,
        })
    } else {
        res.status(404)
        throw new Error("User Not Found")
    }
});

// Update password
const changePassword = asyncHandler (async (req, res) => {
    // res.send(" Succefullfully updated")
    const user = await User.findById(req.user._id);
    const {oldPassword, password} = req.body

    if(!user) { 
        res.status(400); 
        throw new Error("User not found, please signup"); 
    }

    // Validate
    if(!oldPassword || !password) {
        res.status(400); 
        throw new Error("Please add old and new password"); }

    // Check if old password matches password in DB
    const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password)

    // Save new password
    if (user && passwordIsCorrect) { 
        user.password = password 
        await user.save() 
        res.status(200).send("Password change Succeful"); 
    } else { 
        res.status(400); 
        throw new Error("old password is incorrect");
    }

});

// Fogot Password
const forgotPassword = asyncHandler (async (req, res) => {
    res.send("Forgot Password")
});




module.exports = {
    registerUser,
    loginUser,
    logout,
    getUser,
    loginStatus,
    updateUser,
    changePassword,
    forgotPassword,
};