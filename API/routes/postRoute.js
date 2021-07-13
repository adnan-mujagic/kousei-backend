let router = require("express").Router();
let postController = require("../controllers/postController");

router.route("/posts")
    .get(postController.getAll)

router.route("/posts/:post_id")
    .put(postController.updatePost)
    .delete(postController.deletePost);

router.put("/posts/:post_id/like", postController.likePost);

router.put("/posts/:post_id/unlike", postController.unlikePost)

router.get("/posts/:post_id/likes", postController.getPostLikes)

router.route("/posts/:post_id/comments")
    .get(postController.getPostComments)
    .post(postController.addComment);

module.exports = router;