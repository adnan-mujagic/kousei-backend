const Interest = require("../models/interestModel");
const JWT = require("../utilities/jwt");

module.exports.getAllInterests = (req, res) => {
    let regex = req.query.search ? req.query.search : "";
    Interest.find().exec(function (err, interests){
        if(err){
            res.json({
                status:"Couldn't find interests!"
            })
        }
        else{
            for(let i = 0; i < interests.length; i++){
                if(!interests[i].name.toLowerCase().includes(regex.toLowerCase())){
                    interests.splice(i, 1);
                    i--;
                }
            }
            res.json({
                status:"Interests fetched successfully!",
                data: interests
            })
        }
    })
}

module.exports.addInterest = (req, res) => {
    try {
        const decoded = JWT.verify(req.headers.authentication)
        if(decoded.role == "ADMIN"){
            const {name} = req.body;
            let interest = new Interest();
            interest.name = name;
            interest.save(function(err){
                if(err){
                    res.json({
                        status:"Something went wrong when adding the interest!"
                    })
                }
                res.json({
                    status:"Interest saved successfully!",
                    data:interest
                })
            })
        }
        else{
            res.json({
                status:"Invalid authorization for this action! Your role should be ADMIN!"
            })
        }
        
        
        
    } catch (error) {
        res.json({
            status: error.message
        })
    }
}