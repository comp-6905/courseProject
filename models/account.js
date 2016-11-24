var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: {type: String},
    password: {type: String},
    _id :  {type: Number, required: true},
    firstName : {type: String, required: true},
    lastName : {type: String, required: true},
    // mobile : {type: String, required: true},
    // dob : {type: String},
    // sex : {type: String,required: true},
    // country : {type: String},
    // status : {type: String},
    // preference: {type: String,required: true},
    date : Date,
    assigned: {type: Boolean, default: false},
    car: {type: Number, ref: 'Car'},
    reservation: {type: String, ref: 'Reservation'}


});




Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('customer', Account);
