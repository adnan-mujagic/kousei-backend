let express = require("express")
let mongoose = require("mongoose")
let port = process.env.PORT || 3000;
let config = require("./config.js");
let cors = require("cors")
require("dotenv").config();

// Import routes here!
let userRoute = require("./API/routes/userRoute.js")
let postRoute = require("./API/routes/postRoute")
let commentRoute = require("./API/routes/commentRoute")
let conversationRoute = require("./API/routes/conversationRoute")

const app = express();

app.use(cors())

app.listen(port, function () {
    console.log("Listening on port " + port)
})

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json())

// Here we will add all the routes!
app.use("/api", userRoute)
app.use("/api", postRoute)
app.use("/api", commentRoute)
app.use("/api", conversationRoute)

const mongo = mongoose.connect(process.env.DB_PATH, config.DB_OPTIONS);

mongo.then(() => {
    console.log("Connected to Mongo");
}).catch(e => {
    console.log(e.message);
})