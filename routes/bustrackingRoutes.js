/** 
 * Author: Luis Toro
 * Creation Date: 3/23/2017
 *
 * Description: Contains Bus Tracking app routes and queries 
 * 
 * Routes:
 * /updateRoute send bus id and route id
 * /login send username password, return driver id if successful, return -1 if unsuccessful
 * /logout 
 * /getDriver info with route and bus will get bus name, bus id, driver name, driver lastname, driver id, route id, route name
 * /update status param bus id, bus status
 * getRoute send back all route ids and route names
**/


var express = require("express");
var router= express.Router();
var pg = require("pg");
const database_URL=  'postgres://wymxggcwikpwav:203bccfd54e249de1659cdcb1d99cac0f82a14eb9246b51bbef0c1598c46089d@ec2-54-83-205-71.compute-1.amazonaws.com:5432/dd0arpc8l5k2be'
pg.defaults.ssl=true;

// Queries var Declaration.

//Routes for get
var getDriverInfo = 'SELECT driver_id, driver_name, driver_lastname, bus_id, bus_name, route_id, route_name FROM bus NATURAL JOIN driver NATURAL JOIN route WHERE driver_id = $1' 
var getRoutes = 'SELECT * FROM route'
var getDriverBusID = 'SELECT bus_id FROM driver WHERE driver_id = $1'
var getGPSid = 'SELECT gps_id FROM bus WHERE bus_id = $1'

var getDriverBusGPSid = 'SELECT gps_id FROM bus NATURAL JOIN driver WHERE driver_id = $1' 



//Routes for update
var changeDriverRoute = 'UPDATE driver SET route_id = $1 WHERE driver_id = $2'
var updateDriverBus = 'UPDATE driver SET bus_id= $1 WHERE driver_id = $2'
var updateDriverStatus = 'UPDATE driver SET driver_status = $1 WHERE driver_id = $2'
var updateBusLocation = 'UPDATE GPS SET gps_latitude = $1, gps_longitude = $2 WHERE gps_id = $3'

//Routes for login/logout 
var login = 'UPDATE driver SET driver_status = \'logged\' WHERE driver_id = $1'
var logout = 'UPDATE driver SET driver_status = \'not logged\' WHERE driver_id = $1'



//Routes for get
router.get('/getDriverInfo', function(req, res, next) { // Parameter: Route ID
    pg.connect(database_URL, function(err, client, done) {
        client.query(getDriverInfo, [req.body.driver_id], function(err, result) {

            if (err)
             { console.error(err); response.send("Error " + err); }
            else
            res.json(result.rows);
            console.log(result.rows)
            done();
        });
    });
});


router.get('/getRoutes', function(req, res, next) { // Parameter: Route ID
    pg.connect(database_URL, function(err, client, done) {
        client.query(getRoutes, function(err, result) {

            if (err)
             { console.error(err); response.send("Error " + err); }
            else
            res.json(result.rows);
            console.log(result.rows)
            done();
        });
    });
});


//Routes for update

router.put('/changeDriverRoute', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(changeDriverRoute,[res.body.route_id, res.body.driver_id] ,function(err, result) {

            if (err)
             { console.error(err); response.send("Error" + err); }
            else
            res.json(result.rows);
            console.log(result.rows)
            done();
        });
    });
});

router.put('/updateDriverBus', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(updateDriverBus,[res.body.bus_id, res.body.driver_id] ,function(err, result) {

            if (err)
             { console.error(err); response.send("Error" + err); }
            else
            res.json(result.rows);
            console.log(result.rows)
            done();
        });
    });
});

router.put('/updateDriverStatus', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(updateDriverStatus,[res.body.driver_status, res.body.driver_id] ,function(err, result) {

            if (err)
             { console.error(err); response.send("Error" + err); }
            else
            res.json(result.rows);
            console.log(result.rows)
            done();
        });
    });
});


/*
updateBusLocation server route use run two querties:
    getDriverBusGPSid 
        Parameter: driver_id
        Get: GPS ID of the corresponding driver bus

    updateBusLocation
        Parameter: gps_latitude, gps_longitude, gps_id
        Update: Actual location of the bus  usign gps_latitude and gps_longitude parameters 
*/
router.put('/updateBusLocation', function(req, res, next) { 

       var gps_id=0;
    
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {

     ////////verify if getDriverBusGPSid route work propertly//////////////////
        client.query(getDriverBusGPSid,[res.body.driver_id] ,function(err, result) {
            if (err)
             { console.error(err); response.send("Error" + err); }

            // Get the bus ID depending the driver
            else
            gps_id = result.rows[0].gps_id
            res.json(gps_id);
            console.log(gps_id)
            done();

            //Update the localization of the Driver Bus usign the bus GPS ID
            client.query(updateBusLocation,[gps_id] ,function(err, result) {

            if (err)
             { console.error(err); response.send("Error" + err); }
            else
            res.json(result.rows)
            console.log(result.rows)

            done();

            });
        });
    });
});





//Routes for login/logout

router.put('/login', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(login,[res.body.driver_status, res.body.driver_id] ,function(err, result) {

            if (err)
             { console.error(err); response.send("Error" + err); }
            else
            res.json(result.rows);
            console.log(result.rows)
            done();
        });
    });
});

router.put('/logout', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(logout,[res.body.driver_status, res.body.driver_id] ,function(err, result) {

            if (err)
             { console.error(err); response.send("Error" + err); }
            else
            res.json(result.rows);
            console.log(result.rows)
            done();
        });
    });
});


module.exports=router;

