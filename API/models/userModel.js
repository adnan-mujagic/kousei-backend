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
    ],
    coordinates: {
        longitude: Number,
        latitude: Number,
        updated: Date
    },
    shown_on_map:{
        type: Boolean,
        default: false
    },
    interests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Interest"
        }
    ],
    distance_importance: {
        type: Number,
        default: 0.5
    }
})

let User = mongoose.model("User", userSchema);

module.exports = User;