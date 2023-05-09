const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "please add a name"]
    },
    email: {
        type: String,
        required: [true, "please add a email"],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email"
        ]
    },
    password: {
            type: String,
            required: [true, "please add a password"],
            minLength: [6, "password must be up to 6 characters"],
            maxLength: [23, "password must not be mord than 23 characters"],
    },
    photo: {
            type: String,
            required: [true, "please add a photo"],
            default: "https://i.ibb.co/4pDNDk1/avatar.png"
    },
    phone: {
        type: String,
            default: "+234"
    },
    Bio: {
        type: String,
        maxLength: [250, "Bio must not be more than 250 characters"],
        default: "bio",
    },
},
{
    timestamps: true,
}
)

const User = mongoose.model("User", userSchema)
module.exports = User