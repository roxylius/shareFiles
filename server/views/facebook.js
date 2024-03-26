require('dotenv').config();

const express = require('express');
const FacebookStrategy = require('passport-facebook').Strategy;
const passport = require('passport');
const User = require('../schema/user');

const facebookRouter = express.Router();

// Facebook Strategy Configuration
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "/api/auth/facebook/redirect",
    profileFields: ['id', 'displayName', 'photos', 'email']
    // Ensure profileFields include what you need
},
    (accessToken, refreshToken, profile, cb) => {
        console.log("profile", profile);
        User.findOrCreate({ facebookId: profile.id }, { name: profile.displayName, email: profile.emails[0].value, provider: 'facebook' }, (error, user) => {
            return cb(error, user);
        });
    }));

// Facebook Authentication Initiation
facebookRouter.get('/', passport.authenticate('facebook', { scope: ['email'] }),);

// Facebook Redirect Handling
facebookRouter.get('/redirect', passport.authenticate('facebook', { failureRedirect: '/api/auth/facebook/fail' }), (req, res) => {
    // ... Same logic to check user-agent and redirect accordingly
    // Consider using res.redirect(302, ...); for temporary redirect 
    // Check the user-agent header
    console.log("test1");
    const userAgent = req.headers['user-agent'];

    // Check if the request is coming from an Android device
    const isAndroid = userAgent.includes('Android');

    // Successful authentication, redirect based on the client
    const clientURL = process.env.ANDROID_CLIENT_URL;
    const desktopURL = process.env.DESKTOP_CLIENT_URL;

    console.log("req.user", req.user);

    if (isAndroid) {
        // Redirect to the Android client
        console.log("redirecting to android");
        res.redirect(clientURL + "/signup?" + "name=" + encodeURIComponent(req.user.name) + "&email=" + encodeURIComponent(req.user.email) + "&id=" + encodeURIComponent(req.user.id) + "&isUser=true");
    } else {
        // Redirect to the desktop client
        res.redirect(desktopURL + "/signup?" + "name=" + encodeURIComponent(req.user.name) + "&email=" + encodeURIComponent(req.user.email));
    }

});

// Facebook Authentication Failure Handling
facebookRouter.get('/fail', (req, res) => {
    // Check the user-agent header
    const userAgent = req.headers['user-agent'];

    // Check if the request is coming from an Android device
    const isAndroid = userAgent.includes('Android');

    // Successful authentication, redirect based on the client
    const clientURL = process.env.ANDROID_CLIENT_URL;
    const desktopURL = process.env.DESKTOP_CLIENT_URL;

    console.log("req.user", req.user);

    if (isAndroid) {
        // Redirect to the Android client
        res.redirect(clientURL + "/signup?" + "&isUser=false");
    } else {
        // Redirect to the desktop client
        // res.redirect(desktopURL + "/signup?" + "name=" + encodeURIComponent(req.user.name) + "&email=" + encodeURIComponent(req.user.email));
        res.status(401).json('Failed authentication!');
    }
});

module.exports = facebookRouter;
