let User = require("../models/userModel");

class UserValidation {
    static checkUniqueUsername(user, fn) {
        User.findOne({ username: user }, function (err, user1) {
            if (user1) {
                return fn(null, user1);
            }
            else {
                return fn(new Error("OK"))
            }
        })
    }
}

module.exports = UserValidation;