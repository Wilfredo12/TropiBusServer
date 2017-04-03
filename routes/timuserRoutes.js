/** 
 * Author: Luis Toro
 * Creation Date: 3/18/2017
 *
 * Description: Contains Bus Tracking app routes and queries 
 * 
 * Routes:
 * 	/getAllRoutes
 *  /getRoute 
 *  /getAllStops 
 *  /getNearestStop 
 *  /getStopsFromRoute 
 *  /getBusLocation 
 *  /getMessages 
 *  /getBuses 
**/

var express = require("express");
var router= express.Router();
var pg = require("pg");
const database_URL=  'postgres://wymxggcwikpwav:203bccfd54e249de1659cdcb1d99cac0f82a14eb9246b51bbef0c1598c46089d@ec2-54-83-205-71.compute-1.amazonaws.com:5432/dd0arpc8l5k2be'
pg.defaults.ssl=true;

//Routes queries declaration 

var getAllRoutes = 'SELECT * FROM route'
var getRoute = 'SELECT * FROM route NATURAL JOIN routepath WHERE route_id=$1'
var getAllStops = 'SELECT * FROM stop'  
var getStopsFromRoute = 'SELECT * FROM stop WHERE route_id=$1'
var getBusLocation = 'SELECT bus_latitude, bus_longitude FROM Bus NATURAL JOIN GPS WHERE bus_id=$1'
var getMessages = 'SELECT * FROM message'
var getBuses = 'SELECT * FROM bus'

var getAllRoutes = 'SELECT * FROM route NATURAL JOIN routepath'
var getRoute = 'SELECT * FROM route NATURAL JOIN routepath WHERE route_id=$1'
var getAllStops = 'SELECT * FROM stop'  
var getStopsFromRoute = 'SELECT * FROM stop NATURAL JOIN route_stop WHERE route_id=$1'
var getBusLocation = 'SELECT gps_latitude, gps_longitude FROM bus NATURAL JOIN gps NATURAL JOIN route WHERE route_id=$1'
var getMessages = 'SELECT * FROM Message'

var getRouteStatus='SELECT route_id, bus_status from route NATURAL JOIN bus WHERE bus_status="Active" OR bus_status="Changing Turn"'

//get all routes from database and send them back as response
router.get('/getAllRoutes', function(req, res, next) {
    console.log("entre a cojer todas las rutas")
    //connnect to database
    pg.connect(database_URL, function(err, client, done) {
        //run query
        client.query(getAllRoutes, function(err, result) {

            if (err)
             { console.error(err); res.send("Error " + err); }
            else{
                //run query
            // client.query(getRouteStatus, function(err, result1) {

            //     if (err)
            //     { console.error(err); res.send("Error " + err); }
            //     else{
            //     var results=result.rows;
            //     var tempResults=result1.rows;
            //     //if no buses are active set status of routes to inactive
            //     if(tempResults.length==0){
            //         for(var i=0;i<results.length;i++){
            //             results.bus_status="Inactive"
            //         }
            //     }
            //     //buses are active on some route
            //     else{
            //         for(var i=0;i<tempResults.length;i++){
            //             var active=false;
            //             for(var j=0;j<results.length;j++){
            //                 if(results[j].route_id==tempResults[i].route_id){
            //                     results[j].bus_status=tempResults[i].bus_status
            //                     active=true;
            //                     break;
            //                 }
            //             }
            //              if(!active){
            //                     results[i].bus_status="Inactive"
            //                 }
            //         }
            //     }
            //     //sending result back as json
            //     res.json(results.rows);
            //     done();
            //     }
            // });
            //sending result back as json
            res.json(result.rows);
            done();
            }
        });
    });
});

//get route with specific route id from database and send the information back as response
router.get('/getRoute', function(req, res, next) { // Parameter: Route ID
    console.log("entre a cojer info ruta especifica",req.query.route_id)
    //connect to database
    pg.connect(database_URL, function(err, client, done) {
        //run query
        client.query(getRoute, [req.query.route_id], function(err, result) {

            if (err)
             { console.error(err); res.send("Error " + err); }
            else{
            //sending result back as json
            res.json(result.rows);
            done();
            }
        });
    });
});

//get all bus stops information from database and send the information back as response
router.get('/getAllStops', function(req, res, next) {
    console.log("entre cojer info de todas las paradas")
    //connecting to database
    pg.connect(database_URL, function(err, client, done) {
        //run query
        client.query(getAllStops, function(err, result) {

            if (err)
             { console.error(err); res.send("Error " + err); }
            else{
            //sending result back as json
            res.json(result.rows);
            done();
            }
        });
    });
});

//get all bus stops from specific route and send info back as response
router.get('/getStopsFromRoute', function(req, res, next) {//Parameter: Route ID
    console.log("cojer paradas de ruta especifica",req.query.route_id)
    //conneting to database
    pg.connect(database_URL, function(err, client, done) {
        //running query
        client.query(getStopsFromRoute,[req.query.route_id], function(err, result) {

            if (err)
             { console.error(err); res.send("Error " + err); }
            else{
            //sending response back as  json
            res.json(result.rows);
            done();
            }
        });
    });
});

//getting bus location from specific route
router.get('/getBusLocation', function(req, res, next) {
    console.log("buscando localizacion de bus",req.query.route_id)
    //connecting to database
    pg.connect(database_URL, function(err, client, done) {
        //runnig query
        client.query(getBusLocation, [req.query.route_id],function(err, result) {

            if (err)
             { console.error(err); response.send("Error " + err); }
            else{
            //sending result back as json
            res.json(result.rows);
            done();
            }
        });
    });
});

//getting messages posted by administrator
router.get('/getMessages', function(req, res, next) {
    console.log("getting messages")
    //connecting to database
    pg.connect(database_URL, function(err, client, done) {
        //run query
        client.query(getMessages, function(err, result) {

            if (err)
             { console.error(err); response.send("Error " + err); }
            else{
            //send result back as json
            res.json(result.rows);
            done();
            }
        });
    });
});



module.exports=router;

