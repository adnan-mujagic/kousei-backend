let mongoose = require("mongoose");

let postSchema = mongoose.Schema({
    caption: String,
    image: String,
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    comments_enabled: {
        type: Boolean,
        default: true
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
})

let Post = mongoose.model("Post", postSchema);

module.exports = Post;