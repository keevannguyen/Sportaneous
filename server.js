const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const models = require("./models/models.js");
const Event = models.Event;
const request = require('request');
/*
const exphbs = require('express-handlebars')



app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts')
}))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))
*/

if (! process.env.MONGODB_URI){
  console.log('Error: MONGODB_URI is not set. Did you run source env.sh ?');
  process.exit(1);
}
mongoose.connect(process.env.MONGODB_URI);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false }));


// DO NOT REMOVE THIS LINE :)
// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });



function saveEvent(sport, lat, long, startTime, endTime){
  let newEvent = new Event({
    sport: sport,
    location: {
      type: 'Point',
      coordinates: [lat, long]
    },
    startTime: new Date(startTime),
    endTime: new Date(endTime),
  });
  newEvent.save();
}

//ROUTES
//create new event route
app.post('/createEvent', function(req, res){
  let lat;
  let long;
  if(req.body.address){
    console.log(req.body.address);
    console.log(234);
    let url = "https://maps.googleapis.com/maps/api/geocode/json?address="+ req.body.address.street.split(' ').join('+') +
     ",+" + req.body.address.city.split(' ').join('+') +
      ",+" + req.body.address.state.split(' ').join('+') +
      "&key="+ process.env.GOOGLE_API_KEY;

    request(url, function (error, response, body) {
      if(error){
        return res.json({
          success:false
        })
      }else{
        let parseBody = JSON.parse(body);
        lat = parseBody.results[0].geometry.location.lat;
        long = parseBody.results[0].geometry.location.lng;
      }

      saveEvent(req.body.sport, lat, long, req.body.startTime, req.body.endTime);
      res.json({
        success: true
      });
    });

  }else{
    lat = req.body.latitude;
    long = req.body.longitude;
    saveEvent(req.body.sport, lat, long, req.body.startTime, req.body.endTime);
    console.log('hi');
    res.json({
      success: true
    });
  }

})

//GET all events
app.get('/events', function(req, res){
  Event.find({}, function(err, events){
    if(err){
      res.json({
        success: false,
        events: []
      });
    }else{
      res.json({
        success: true,
        events: events
      })
    }
  });
})


// error handlers

// development error handler
// will print stacktrace
/*
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
*/
app.listen(process.env.PORT || 3000);
