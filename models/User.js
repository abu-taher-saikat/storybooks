const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Create Schema
const UserSchema = new Schema({
    googleID : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    firstName : {
        type : String
    },
    lastName :{
        type : String
    },
    image :{
        type : String
    }
});


// create colllection and add shcema
const User = mongoose.model('users', UserSchema);
module.exports = User;