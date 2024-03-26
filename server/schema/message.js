const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

// Get the Schema object from Mongoose
const Schema = mongoose.Schema;

// Create a schema to define the structure of the user data
const messagesSchema = new Schema({
    id: {
        type: String,
        unique: true
    },
    name: String
});

// Add passport-local-mongoose plugins to handle username and password fields and find or create users
messagesSchema.plugin(passportLocalMongoose, { usernameField: 'id' });
messagesSchema.plugin(findOrCreate);

// Create a model using the user schema
const Message = new mongoose.model('Message', messagesSchema);

module.exports = Message;
