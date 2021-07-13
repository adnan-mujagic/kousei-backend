let Post = require("../models/postModel");
let Comment = require("../models/commentModel");
let jwt = require("../utilities/jwt")

module.exports.getAll = (req, res) => {
    let regex = new RegExp(req.query.search ? req.query.search : "", "i");
    Post.find({ caption: regex })
        .sort({ created_at: -1 })
        .populate("creator")
        .exec(function (err, posts) {
            if (err) {
                res.json({
                    status: "We are having trouble getting posts right now!"
                })
            }
            else {
                res.json({
                    status: "Success",
                    data: posts
                })
            }
        })
}

module.exports.getSpecificPost = (req, res) => {
    Post.findOne({_id: req.params.post_id})
        .populate("creator")
        .exec(function(err, post){
            if(err){
                res.json({
                    status:"Can't get this post!"
                })
            }
            else{
                res.json({
                    status:"Success",
                    data:post
                })
            }
        })
}

module.exports.updatePost = (req, res) => {
    Post.findOne({ _id: req.params.post_id })
        .exec(function (err, post) {
            if (err) {
                res.json({
                    status: "We can't find that post!"
                })
            }
            else {
                post.caption = req.body.caption ? req.body.caption : post.caption;
                post.image = req.body.image ? req.body.image : post.image;
                post.comments_enabled = req.body.comments_enabled ? req.body.comments_enabled : post.comments_enabled;

                post.save(function (err) {
                    if (err) {
                        res.json({
                            status: "We had trouble updating your post!"
                        })
                    }
                    else {
                        res.json({
                            status: "Update successful!",
                            data: post
                        })
                    }
                })
            }
        })
}

module.exports.deletePost = (req, res) => {
    Post.findOneAndDelete({ _id: req.params.post_id })
        .exec(function (err, post) {
            if (err) {
                res.json({
                    status: "We couldn't delete this post!"
                })
            }
            else {
                res.json({
                    status: "Post deleted!",
                    data: post
                })
            }
        })
}

module.exports.addComment = (req, res) => {
    Post.findOne({ _id: req.params.post_id })
        .exec(function (err, post) {
            if (err) {
                res.json({
                    status: "We are having trouble with this post!"
                })
            }
            else {
                let auth_token = jwt.verify(req.headers.authentication)
                let comment = new Comment();
                comment.content = req.body.content;
                comment.post = post._id;
                comment.creator = auth_token.uid;

                comment.save(function (err) {
                    if (err) {
                        res.json({
                            status: "Couldn't post this comment!"
                        })
                    }
                    else {
                        res.json({
                            status: "Comment added",
                            data: comment
                        })
                    }
                })
            }
        })
}

module.exports.getPostComments = (req, res) => {
    Comment.find({ post: req.params.post_id })
        .populate("creator")
        .sort({ created_at: -1 })
        .exec(function (err, comments) {
            if (err) {
                res.json({
                    status: "Can't get comments for this post!"
                })
            }
            else {
                res.json({
                    status: "Success",
                    data: comments
                })
            }
        })
}

module.exports.likePost = (req, res) => {
    let auth_token = jwt.verify(req.headers.authentication);
    Post.findOne({ _id: req.params.post_id })
        .exec(function (err, post) {
            if (err) {
                res.json({
                    status: "Couldn't find that post!"
                })
            }
            else {
                if (post.likes.includes(auth_token.uid)) {
                    res.json({
                        status: "You already liked this post!"
                    })
                }
                else {
                    post.likes.push(auth_token.uid);
                    post.save(function (err) {
                        if (err) {
                            res.json("We had trouble liking this post!");
                        }
                        else {
                            res.json({
                                status: "Post liked!",
                                data: post
                            })
                        }
                    })
                }
            }
        })
}

module.exports.unlikePost = (req, res) => {
    let auth_token = jwt.verify(req.headers.authentication);
    Post.findOne({ _id: req.params.post_id })
        .exec(function (err, post) {
            if (err) {
                res.json({
                    status: "Couldn't get this post!"
                })
            }
            else {
                if (post.likes.includes(auth_token.uid)) {
                    let i = post.likes.indexOf(auth_token.uid)
                    post.likes.splice(i, 1);

                    post.save(function (err) {
                        if (err) {
                            res.json({
                                status: "Couldn't unlike this post!"
                            })
                        }
                        else {
                            res.json({
                                status: "Post unliked",
                                data: post
                            })
                        }
                    })
                }
                else {
                    res.json({
                        status: "You don't like this post in the first place."
                    })
                }
            }
        })
}

module.exports.getPostLikes = (req, res) => {
    Post.findOne({ _id: req.params.post_id })
        .select("likes")
        .populate("likes")
        .exec(function (err, result) {
            if (err) {
                res.json({
                    status: "We can't get this user's likes!"
                })
            }
            else {
                res.json({
                    status: "Success!",
                    data: result.likes
                })
            }
        })
}