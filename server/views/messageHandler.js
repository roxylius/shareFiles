const express = require('express');

const messageRouter = express.Router();

//import message schema
const Message = require('../schema/message');

//handles the post request of message page
messageRouter.post('/add', async (req, res) => {
    const { userId, friendId, message } = req.body;
    console.log("userid", userId, "friendId", friendId, "message", message);

    const foundUser = await Message.findOne({ id: id });

    if (foundUser) {
        foundUser.messages.push(message);
        console.log("found user: ", foundUser);
        res.status(200).json({ message: 'success' });
        // foundUser.save();
    }
    res.status(200).json({ message: 'failed' });
    console.log("add message post request: ", req.body);
});

module.exports = messageRouter;
