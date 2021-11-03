let User = require("../models/userModel")
let Post = require("../models/postModel")
let UserValidation = require("../utilities/user_validation")
let jwt = require("../utilities/jwt")
let CryptoJS = require("crypto-js")
let compareLikes = require("../utilities/compareLikes")
let comparePopularity = require("../utilities/comparePopularity")

module.exports.register = (req, res) => {
    let user = new User();
    user.username = req.body.username;
    user.password = CryptoJS.MD5(req.body.password);
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
    User.find({ username: regex })
        .populate("following followers")
        .exec(function (err, users) {
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
    User.findOne({ _id: req.params.user_id })
    .populate("followers following")
    .exec(function (err, user) {
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
            try {
                let decoded = jwt.verify(req.headers.authentication);
                if(decoded.uid == user._id){
                    user.full_name = req.body.full_name ? req.body.full_name : user.full_name;
                    user.username = req.body.username ? req.body.username : user.username;
                    user.password = req.body.password ? req.body.password : user.password;
                    user.email = req.body.email ? req.body.email : user.email;
                    user.profile_picture = req.body.profile_picture ? req.body.profile_picture : user.profile_picture;
                    user.phone_number = req.body.phone_number ? req.body.phone_number : user.phone_number;
                    user.age = req.body.age ? req.body.age : user.age;
                    user.bio = req.body.bio ? req.body.bio : user.bio;
                    user.coordinates = req.body.coordinates ? req.body.coordinates : user.coordinates;
                    user.shown_on_map = req.body.shown_on_map!=null ? req.body.shown_on_map : user.shown_on_map;
                    user.interests = req.body.interests ? req.body.interests : user.interests;

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
                else{
                    res.json({
                        status:"You have no authentication to make changes to this user!"
                    })
                }
            } catch (error) {
                res.json({
                    status: error.message
                })
            }
            
            

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
            if (user.password == CryptoJS.MD5(req.body.password)) {
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
    let auth_token = jwt.verify(req.headers.authentication, process.env.JWT_KEY);
    if(auth_token.uid == req.params.user_id){
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
    else{
        res.json({
            status:"You can't add posts for this user!"
        })
    }
    
}

module.exports.getUserPosts = (req, res) => {
    let sortBy = null;
    if(req.query.order=="normal"){
        sortBy={
            created_at: -1
        }
    }
    Post.find({ creator: req.params.user_id })
        .sort(sortBy)
        .exec(function (err, posts) {
            if (err) {
                res.json({
                    status: "We can't get this users posts right now!"
                })
            }
            else {
                if(req.query.order=="likes"){
                    posts.sort(compareLikes);
                }
                else if(req.query.order=="popularity"){
                    posts.sort(comparePopularity);
                }
                res.json({
                    status: "Success",
                    data: posts
                })
            }
        })
}

module.exports.follow = (req, res) => {
    let auth_token = jwt.verify(req.headers.authentication);
    if (auth_token.uid != req.params.user_id) {
        User.findOne({_id: auth_token.uid})
            .exec(function(err, user){
                if(err){
                    res.json({
                        status:"Couldn't add this user to your followers!"
                    })
                }
                else{
                    if(!user.following.includes(req.params.user_id)){
                        user.following.push(req.params.user_id);

                        user.save(function(err){
                            if(err){
                                res.json({
                                    status:"Couldn't add this user to your followers!"
                                })
                            }
                        })
                    }
                }
            })
        User.findOne({ _id: req.params.user_id })
            .exec(function (err, user) {
                if (err) {
                    res.json("We are having trouble finding the user.")
                }
                else {
                    if (!user.followers.includes(auth_token.uid)) {
                        user.followers.push(auth_token.uid);
                        user.save(function (err) {
                            if (err) {
                                res.json({
                                    status: "There was a problem while trying to follow a user"
                                })
                            }
                            else {
                                res.json({
                                    status: "You are now following " + user.username,
                                    data: user
                                })
                            }
                        })
                    }
                    else {
                        res.json({
                            status: "You are already following this person!"
                        })
                    }
                }
            })

    }
    else {
        res.json({
            status: "You cannot follow yourself!"
        })
    }
}

module.exports.unfollow = (req, res) => {
    let auth_token = jwt.verify(req.headers.authentication);
    if (auth_token.uid != req.params.user_id) {
        User.findOne({ _id: req.params.user_id })
            .exec(function (err, user) {
                if (err) {
                    res.json({
                        status: "Trouble finding the user"
                    })
                }
                else {
                    if (user.followers.includes(auth_token.uid)) {
                        for (let i = 0; i < user.followers.length; i++) {
                            if (user.followers[i] == auth_token.uid) {
                                user.followers.splice(i, 1);
                                i--;
                            }
                        }

                        User.findOne({_id:auth_token.uid}).exec(function(err, currentUser){
                            if(err){
                                res.json({
                                    status:"Error finding you!",
                                })
                            }
                            else{
                                
                                for(let i = 0; i < currentUser.following.length; i++){
                                    if(String(currentUser.following[i]) == String(user._id)){
                                        currentUser.following.splice(i, 1);
                                        i--;
                                        break;
                                    }
                                }
                                console.log(currentUser.following);
                                currentUser.save(function(err){
                                    if(err){
                                        res.json({
                                            status:"Error!"
                                        })
                                    }
                                })
                            }
                        })

                        user.save(function (err) {
                            if (err) {
                                res.json({
                                    status: "Can't unfollow right now"
                                })
                            }
                            else {
                                res.json({
                                    status: "Success",
                                    data: user
                                })
                            }
                        })
                    }
                    else {
                        res.json({
                            status: "You cannot unfollow if you are not following beforehand."
                        })
                    }
                }
            })
    }
    else {
        res.json({
            status: "You cannot unfollow yourself!"
        })
    }

}

module.exports.seeFollowers = (req, res) => {
    User.findOne({ _id: req.params.user_id })
        .select('followers')
        .populate('followers')
        .exec(function (err, result) {
            if (err) {
                res.json({
                    status: "Something went wrong!"
                })
            }
            else {
                res.json({
                    status: "Success",
                    data: result.followers
                })
            }
        })
}

module.exports.getUserInterests = (req, res) => {
    User.findOne({_id: req.params.user_id}).select("interests -_id").populate("interests")
        .exec(function(err, interests){
            if(err){
                res.json({
                    status:"Couldn't find this user's interests!"
                })
            }
            else{
                res.json({
                    status:"User interests fetched!",
                    data: interests
                })
            }
        })
}