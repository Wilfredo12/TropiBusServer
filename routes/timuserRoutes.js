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


 
var getStopsFromRoute = 'SELECT * FROM route_stop NATURAL JOIN stop WHERE route_id=$1 ORDER BY stop_order' 
var getBusLocation = 'SELECT gps_latitude, gps_longitude, bus_name,bus_status FROM bus NATURAL JOIN gps WHERE route_id=$1'
var getMessages = 'SELECT * FROM message'
var getAllRoutes = 'SELECT * FROM route NATURAL JOIN routepath ORDER BY route_area'
var getRouteStatus='SELECT route_id, bus_status from route NATURAL JOIN bus WHERE bus_status<>\'Inactive\''

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
            client.query(getRouteStatus, function(err, result1) {

                if (err)
                { console.error(err); res.send("Error " + err); }
                else{
                console.log("coji el status de las rutas")
                var results=result.rows;
                var tempResults=result1.rows;
                console.log("routes status result",tempResults)
                //if no buses are active set status of routes to inactive
                if(tempResults.length==0){
                    for(var i=0;i<results.length;i++){
                        results[i].status="Inactive"
                    }
                }
                //some buses are active on some route
                else{
                    for(var i=0;i<results.length;i++){
                        var active=false;
                        //if bus has an active or changing driver status, set route status to active
                        for(var j=0;j<tempResults.length;j++){
                            if(results[i].route_id==tempResults[j].route_id){
                                results[i].status="Active"
                                active=true; 
                                break;                                                     
                            }
                        }
                        //if there is no bus on some route with active or changing driver status,
                        //assigned route status to inactive
                         if(!active){
                                results[i].status="Inactive"
                            }
                    } 
                
                }
                //sending result back as json
                res.json(results);
                done();
                }
                
            });
            //sending result back as json
            // res.json(result.rows);
            // done();
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

//script to populate stop table in database
// router.get('/setUpStops', function(req, res, next) {
//     console.log("entre cojer info de todas las paradas")
//     //connecting to database
//     pg.connect(database_URL, function(err, client, done) {
//         //run query
//         for(var i=0;i<stops.length;i++){
            
//             var stop=stops[i];
//             console.log(stop)
//             var query="INSERT INTO stop(stop_name,stop_description,stop_latitude,stop_longitude) VALUES (\'"+stop.stop_name+"\',\'"+stop.stop_description+"\',"+stop.stop_latitude+","+stop.stop_longitude+")";
//             client.query(query, function(err, result) {

//             if (err)
//              { console.error(err); res.send("Error " + err); }
//             else{
//             //sending result back as json
            
//             }
//         });
//         }
//         res.json({success:1});
//         done();
//     });
// });

// router.get('/setUpRoutes', function(req, res, next) {
//     console.log("entre a insertar rutas")
//     //connecting to database
//     pg.connect(database_URL, function(err, client, done) {
//         //run query
//         for(var i=0;i<routes.length;i++){
            
//             var route=routes[i];
//             console.log(route)
//             var query="INSERT INTO route(route_name,route_description,route_area) VALUES (\'"+route.route_name+"\',\'"+route.route_description+"\',\'"+route.route_area+"\')";
//             client.query(query, function(err, result) {

//             if (err)
//              { console.error(err); res.send("Error " + err); }
//             else{
//             //sending result back as json
            
//             }
//         });
//         }
//         res.json({success:1});
//         done();
//     });
// });

// router.get('/setUpRoutePaths', function(req, res, next) {
//     console.log("entre a insertar path de las rutas")
//     //connecting to database
//     pg.connect(database_URL, function(err, client, done) {
//         //run query
        
//         for(var i=0;i<routes.length;i++){
            
//             var route=routes[i];
//             console.log(route)
//             var query="INSERT INTO routepath(route_path) VALUES (\'"+route.path+"\')";
//             client.query(query, function(err, result) {

//             if (err)
//              { console.error(err); res.send("Error " + err); }
//             else{
//             //sending result back as json
            
//             }
//         });
//         }
//         res.json({success:1});
//         done();
//     });
// });

module.exports=router;

