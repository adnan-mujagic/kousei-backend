let Message = require("./../models/messageModel");
let Conversation = require("./../models/conversationModel");
let JWT = require("./../utilities/jwt");

module.exports.createMessage = (req, res) => {
    decoded = JWT.verify(req.headers.authentication);
    let message = new Message();
    message.conversation = req.params.conversation_id;
    message.sender = decoded.uid;
    message.content = req.body.content;

    Conversation.findOne({_id: req.params.conversation_id})
        .exec(function(err, conversation){
            if(err){
                res.json({
                    status:"Error with getting the convo",
                })
            }
            else{
                if(conversation.participants.includes(decoded.uid)){
                    message.save(function(err){
                        if(err){
                            res.json({
                                status:"Couldn't send this message!"
                            })
                        }
                        else{
                            res.json({
                                status:"Message sent",
                                data:message
                            })
                        }
                        
                    })
                }
                else{
                    res.json({
                        status:"You cannot send messages in this conversation!"
                    })
                }
            }
        })
}