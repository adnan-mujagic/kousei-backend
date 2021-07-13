let router = require("express").Router()
let userController = require("../controllers/userController");

router.get("/", (req, res) => {
    res.json({
        message: "API is working",
        version: "1.0.0"
    })
})

router.route("/users")
    .get(userController.getUsers)
    .post(userController.register);

router.route("/users/login")
    .post(userController.login)

router.route("/users/:user_id")
    .get(userController.getSpecificUser)
    .delete(userController.deleteSpecificUser)
    .put(userController.updateUser);

router.route("/users/:user_id/followers")
    .get(userController.seeFollowers)
    .put(userController.follow);

router.route("/users/:user_id/unfollow")
    .put(userController.unfollow)

router.route("/users/:user_id/posts")
    .get(userController.getUserPosts)
    .post(userController.addPost);

module.exports = router;