/**
 * Created by Jia on 10/27/2016.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var AddCar = mongoose.model('car', new Schema({
    _id:      {type: Number, required: true, unique: true},
    brand:    {type: String, required: true},
    classType:     {type: String, required: true},
    price:        {type: Number, required: true},
    parkLocation:    {type: String, required: true},
    license:        {type: String, required: true, unique: true},
    color:          {type: String, required: true},
    assigned:     {type: Boolean, default: false},
    customer:    {type: String}
}
));


var AddReservation = mongoose.model('reservation', new Schema({
    renteeName:      {type: String, required: true},
    startDate:    {type: Date, required: true},
    endDate:     {type: Date, required: true},
    startTime:        {type: String, required: true, unique: true},
    endTime:    {type: String, required: true},
    carID:        {type: String, required: true},
    price:          {type: Number, required: true}

})
);




module.exports = {
    AddCar: AddCar,
    AddReservation: AddReservation,
    // AddEvent: AddEvent,

}
