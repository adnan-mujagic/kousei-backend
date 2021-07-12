let router = require("express").Router();
let postController = require("../controllers/postController");

router.route("/posts")
    .get(postController.getAll)

router.route("/posts/:post_id")
    .put(postController.updatePost)
    .delete(postController.deletePost);

module.exports = router;