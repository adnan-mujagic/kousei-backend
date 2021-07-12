let router = require("express").Router();
let commentController = require("../controllers/commentController")

router.route("/comments/:comment_id")
    .delete(commentController.deleteComment)

module.exports = router;