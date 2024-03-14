const express = require('express');
const passport = require('passport');

const userRouter = express.Router();

//import user to search the collection User in MongoDB
const User = require('../schema/user');

// //handled by passport-local-mongoose module
passport.use(User.createStrategy({ usernameField: 'email' })); //verify credentials from DB

//it handle the post request of user page
userRouter.get("/", (req, res) => {
    //check if user is Authenticated 
    if (req.isAuthenticated())
        res.status(200).json(req.user);
    else
        res.status(401).json({ message: 'Authentication Error!' });
});

//to find user from DB and add to messages
userRouter.post('/search-user', async (req, res) => {
    const userName = req.body.name; 

    try {
        const foundUser = await User.findOne({ name: userName });

        if (foundUser) {
            res.status(200).json({ 
                exists: true, 
                userId: foundUser._id, 
                name: foundUser.name  
            }); 
        } else {
            res.status(404).json({ error: "User not in database",exists:false });                       
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


//export the getUserRouter module to app.js which handle all route requests
module.exports = userRouter;


