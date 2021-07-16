let mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
    full_name: String,
    bio: String,
    username: String,
    password: String,
    email: String,
    age: Number,
    phone_number: String,
    created_at: {
        type: Date,
        default: Date.now
    },
    profile_picture: {
        type: String,
        default: "https://image.flaticon.com/icons/png/512/3048/3048189.png"
    },
    role: {
        type: String,
        default: "NORMAL"
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
})

let User = mongoose.model("User", userSchema);

module.exports = User;