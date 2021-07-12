let mongoose = require("mongoose");

let commentSchema = mongoose.Schema({
    content: String,
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

let Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;