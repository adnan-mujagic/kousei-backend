let Comment = require("../models/commentModel");

module.exports.deleteComment = (req, res) => {
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