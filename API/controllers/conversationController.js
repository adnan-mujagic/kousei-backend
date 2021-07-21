let Conversation = require("./../models/conversationModel");
let Message = require("./../models/messageModel")
let JWT = require("./../utilities/jwt");

module.exports.createConversation = (req, res) => {
    let decoded = null ;
    try {
        decoded = JWT.verify(req.headers.authentication)
    } catch (error) {
        console.log(error);
    }
    let convo = new Conversation();
    convo.participants.push(decoded.uid);
    convo.participants.push(req.params.user_id);
    convo.save(function(err){
        if(err){
            res.json({
                status:"Couldn't create a conversation with this user!"
            })
        }
        else{
            res.json({
                status:"Conversation successfully created!",
                data:convo
            })
        }
    })
}

module.exports.getUserConversations = (req, res) => {
    let decoded = null ;
    try {
        decoded = JWT.verify(req.headers.authentication)
    } catch (error) {
        console.log(error);
    }
    Conversation.find()
        .populate("participants")
        .exec(function(err, convos){
            if(err){
                res.json({
                    status:"Couldn't find any conversations"
                })
            }
            else{
                // TERRIBLE NESTED LOOP BY ME BUT I COULDN'T FIGURE OUT A BETTER WAY TOO BAD
                for(let i = 0; i < convos.length; i++){
                    let userIsParticipant = false;
                    for(let j = 0; j < convos[i].participants.length; j++){
                        if(convos[i].participants[j]._id == decoded.uid){
                            userIsParticipant = true;
                        }
                    }
                    if(!userIsParticipant){
                        convos.splice(i, 1);
                        i--;
                    }
                }
                res.json({
                    status:"Successfully found user conversations!",
                    data:convos
                })
            }
        })
        
    
}

module.exports.getConversationMessages = (req, res) => {
    decoded = JWT.verify(req.headers.authentication);
    Conversation.findOne({_id: req.params.conversation_id})
        .exec(function(err, convo){
            if(err){
                res.json({
                    status:"Couldn't get this conversation!"
                })
                
            }
            else{
                if(convo.participants.includes(decoded.uid)){
                    Message.find({conversation: req.params.conversation_id})
                        .populate("sender")
                        .exec(function(err, messages){
                            if(err){
                                res.json({
                                    status:"Trouble getting messages!"
                                })
                            }
                            else{
                                res.json({
                                    status:"Messages retrieved successfully",
                                    data:messages
                                })
                            }
                        })
                }
                else{
                    res.json({
                        status:"You are not a participant of this conversation!"
                    })
                }
            }
        })
    
}