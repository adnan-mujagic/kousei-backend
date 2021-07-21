let mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    content: String,
    conversation:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Conversation"
    },
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    created_at:{
        type: Date,
        default: Date.now
    }
})

let Message = mongoose.model("Message", messageSchema);

module.exports = Message;