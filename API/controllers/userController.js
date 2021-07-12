let User = require("../models/userModel")
let Post = require("../models/postModel")
let UserValidation = require("../utilities/user_validation")
let jwt = require("../utilities/jwt")



module.exports.register = (req, res) => {
    let user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.full_name = req.body.full_name;
    user.phone_number = req.body.phone_number;
    user.email = req.body.email;
    user.bio = req.body.bio;
    user.profile_picture = req.body.profile_picture ? req.body.profile_picture : "https://image.flaticon.com/icons/png/512/3048/3048189.png";

    //Ugliest validation I have ever seen. 
    //I tried to make it work with simple boolean return value,
    //but javascript is actually braindead so this is my last resort, don't judge me!
    UserValidation.checkUniqueUsername(user.username, function (err, u) {
        if (u) {
            res.json({
                status: "That username is already in use!"
            })
        }
        else if (err) {
            user.save(function (err) {
                if (err) {
                    res.json({
                        status: "Something went wrong while trying to save the user!"
                    })
                }
                else {
                    res.json({
                        status: "User successfully saved!",
                        data: user
                    })
                }
            })
        }
    })
}

module.exports.getUsers = (req, res) => {
    let regex = new RegExp(req.query.search ? req.query.search : "", "i");
    User.find({ username: regex }).exec(function (err, users) {
        if (err) {
            res.json({
                status: "Something went wrong!"
            })
        }
        else {
            res.json({
                status: "Successfully retrieved users",
                data: users
            })
        }
    })
}

module.exports.getSpecificUser = (req, res) => {
    User.findOne({ _id: req.params.user_id }).exec(function (err, user) {
        if (err) {
            res.json({
                status: "There was a problem getting this user!"
            })
        }
        else {
            res.json({
                status: "User successfully found!",
                data: user
            })
        }
    })
}

module.exports.deleteSpecificUser = (req, res) => {
    User.findOneAndDelete({ _id: req.params.user_id })
        .exec(function (err, user) {
            if (err) {
                res.json({
                    status: "We are having trouble removing this user!"
                })
            }
            else {
                res.json({
                    status: "User removed successfully",
                    data: user
                })
            }
        })
}

module.exports.updateUser = (req, res) => {
    User.findOne({ _id: req.params.user_id }).exec(function (err, user) {
        if (err) {
            res.json({
                status: "Couldn't find that user!"
            })
        }
        else {

            user.full_name = req.body.full_name ? req.body.full_name : user.full_name;
            user.username = req.body.username ? req.body.username : user.username;
            user.password = req.body.password ? req.body.password : user.password;
            user.email = req.body.email ? req.body.email : user.email;
            user.profile_picture = req.body.profile_picture ? req.body.profile_picture : user.profile_picture;
            user.phone_number = req.body.phone_number ? req.body.phone_number : user.phone_number;
            user.age = req.body.age ? req.body.age : user.age;
            user.bio = req.body.bio ? req.body.bio : user.bio;

            user.save(function (err) {
                if (err) {
                    res.json({
                        status: "Couldn't update that user!"
                    })
                }
                else {
                    res.json({
                        status: "User updated successfully",
                        data: user
                    })
                }
            })

        }
    })
}

module.exports.login = function (req, res) {
    User.findOne({ username: req.body.username }, function (err, user) {
        if (err) {
            res.json({
                status: "Invalid username!"
            });
        }
        else if (user != null) {
            if (user.password == req.body.password) {
                var user_token = jwt.sign(user);
                res.json({
                    status: "Successfully logged in!",
                    token: user_token,
                })
            }
            else {
                res.json({
                    status: "Wrong password!"
                })
            }
        }
        else {
            res.json({
                status: "Invalid username!"
            })
        }
    })
}

module.exports.addPost = (req, res) => {
    User.findOne({ _id: req.params.user_id })
        .exec(function (err, user) {
            if (err) {
                res.json({
                    status: "We are having trouble getting that user!"
                })
            }
            else {
                let post = new Post();
                post.caption = req.body.caption;
                post.image = req.body.image;
                post.comments_enabled = req.body.comments_enabled;
                post.creator = user._id;

                post.save(function (err) {
                    if (err) {
                        res.json({
                            status: "Your post could not be added. It's our fault!"
                        })
                    }
                    else {
                        res.json({
                            status: "Your post was created successfully!",
                            data: post
                        })
                    }
                })
            }
        })
}

module.exports.getUserPosts = (req, res) => {
    Post.find({ creator: req.params.user_id })
        .exec(function (err, posts) {
            if (err) {
                res.json({
                    status: "We can't get this users posts right now!"
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