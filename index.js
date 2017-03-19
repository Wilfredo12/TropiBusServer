var express = require('express');
var app = express();
var bodyParser= require("body-parser");

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

//Add Administrator web app Routes 
var admin= require("./routes/adminRoutes");
app.use("/adminRoutes", admin); 

// //Add Bus tacking app routes
var busTrack = require("./routes/bustrackingRoutes");
app.use("/bustrackingRoutes", busTrack);

//Add TIM user app routes
var timUser = require("./routes/timuserRoutes");
app.use("/timuserRoutes", timUser);



