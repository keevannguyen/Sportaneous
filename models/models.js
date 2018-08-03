var mongoose = require('mongoose');
var Schema = mongoose.Schema

var EventSchema = new Schema(
{
  sport: String,//Name of sport ex. soccer, basketball, football, etc.
  location: //to be used for map integration
  {
    longitude: Number,
    latitude: Number
  },
  startTime: Date,//time event starts
  endTime: Date//time that event will stop showing up on the map for viewers
});

var Event = mongoose.model("Event", EventSchema);

module.exports = {Event: Event}
