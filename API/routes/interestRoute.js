const router = require("express").Router()
const interestController = require("./../controllers/interestController")

router.route("/interests")
    .get(interestController.getAllInterests)
    .post(interestController.addInterest);

module.exports = router;