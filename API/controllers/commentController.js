let Comment = require("../models/commentModel");
let jwt = require("../utilities/jwt");

module.exports.deleteComment = (req, res) => {
    Comment.findOne({ _id: req.params.comment_id })
        .exec((err, comment) => {
            if (err) {
                res.json({
                    status: "Trouble finding this comment!"
                })
            }
            else {
                let auth_token = jwt.verify(req.headers.authentication);
                if (auth_token.uid == comment.creator) {
                    Comment.findOneAndDelete({ _id: req.params.comment_id })
                        .exec(function (err, comment) {
                            if (err) {
                                res.json({
                                    status: "Couldn't delete this comment!"
                                })
                            }
                            else {
                                res.json({
                                    status: "Comment deleted successfully!",
                                    data: comment
                                })
                            }
                        })
                }
                else {
                    res.json({
                        status: "This is not your comment!"
                    })
                }
            }
        })

}