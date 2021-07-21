let mongoose = require("mongoose");

let conversationSchema = mongoose.Schema({
    participants:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
})

let Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;