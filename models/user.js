const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

// defining the user model schema 
const userSchema = new Schema({
    email :{
        type : String,
        required : true
    }
    // as in given in documentation , it will auto. set the username and passwprd by hasing and salting
});

userSchema.plugin(passportLocalMongoose); // we are usingt this as plugin cause  , it will auto. set the username and passwprd by hasing and salting

module.exports = mongoose.model('User', userSchema);
