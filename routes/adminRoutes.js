/** 
 * Author: Luis Toro
 * Creation Date: 3/18/2017
 *
 * Description: Contains Aministrator web app routes and queries 
 * 
 Routes:
 Get:
/getAllRoutes 
/getRoute 
/getAllStops 
/getNearestStop 
/getStopsFromRoute 
/getBusLocation 
/getMessages 
/getBuses 

Updates: 
/updateStop  
/updateRoute 
/updateBusAdmin 
/updateDriver 
/updateMessage 

Add:
/addStop
/addMessage 

Delete:
/deleteStop
/deleteBus 
/deleteMessage 

Create: 
/createDriver
/createBus  
/createRoute
/createStop  

**/

var express = require("express");
var router= express.Router();
var pg = require("pg");
const database_URL="put url here"
pg.defaults.ssl=true;

//Routes for gets
var getAllRoutes = 'SELECT * FROM Route'
var getRoute = 'SELECT * FROM Route NATURAL JOIN Path WHERE route_ID=$1'
var getAllStops = 'SELECT * FROM Stop' 
var getNearestStop 
var getStopsFromRoute = 'SELECT * FROM Stop WHERE route_ID=$1'
var getBusLocation = 'SELECT bus_latitude, bus_longitude FROM Bus NATURAL JOIN GPS'
var getMessages = 'SELECT * FROM Message'
var getBuses = 'SELECT * FROM Bus'

//Routes for Update
var updateStop  
var updateRoute 
var updateBusAdmin 
var updateDriver 
var updateMessage 

//Routes for Add
var addStop
var addMessage 

//Routes for delete
var deleteStop
var deleteBus 
var deleteMessage 

//Routes for create
var createDriver
var createBus  
var createRoute
var createStop  



var user={
    username:"y",
    password:"z"
}

router.get("/test",function(req,res){
    console.log(user)
    res.json(user);
})

module.exports=router;
