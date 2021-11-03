let mongoose = require("mongoose")

let interestSchema = mongoose.Schema({
    name: String,
})

let Interest = mongoose.model("Interest", interestSchema);
module.exports = Interest;