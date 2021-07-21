let router = require("express").Router();
let conversationController = require("./../controllers/conversationController");
let messageController = require("./../controllers/messageController")

router.route("/conversations")
    .get(conversationController.getUserConversations);

router.route("/conversations/:user_id").post(conversationController.createConversation);

// POSSIBLE PROBLEM HOW ARE THE URL PARAMS GOING TO BE DISTINGUISHED?
router.route("/conversations/:conversation_id/messages")
    .get(conversationController.getConversationMessages)
    .post(messageController.createMessage);

module.exports = router;