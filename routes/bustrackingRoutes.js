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
var getDriverInfo = 'SELECT driver_id, driver_firstname, driver_lastname, bus_id, bus_name,bus_status, route_id, route_name FROM bus NATURAL JOIN driver NATURAL JOIN route WHERE driver_id = $1' 
var getRoutes = 'SELECT * FROM route' //SELECT route_id,route_name FROM route
var getDriverBusID = 'SELECT bus_id FROM driver WHERE driver_id = $1'
var getGPSid = 'SELECT gps_id FROM bus WHERE bus_id = $1'

var getDriverBusGPSid = 'SELECT gps_id FROM bus NATURAL JOIN driver WHERE driver_id = $1' 


//Routes for update

var changeDriverRoute = 'UPDATE bus SET route_id = $1 where bus_id=$2'
var updateDriverBus = 'UPDATE driver SET bus_id= $1 WHERE driver_id = $2'
var updateBusStatus = 'UPDATE bus SET bus_status = $1 WHERE bus_id = $2'
var updateBusLocation = 'UPDATE GPS SET gps_latitude = $1, gps_longitude = $2 WHERE gps_id = $3'

//Routes for login/logout 
var checkCredentials= "SELECT driver_id FROM driver WHERE driver_username=$1 and driver_password=$2"
var login = 'UPDATE driver SET driver_status = \'logged\' WHERE driver_id = $1'
var logout = 'UPDATE driver SET driver_status = \'not logged\' WHERE driver_id = $1'



//get information from driver from database and send back to application
router.get('/getDriverInfo', function(req, res, next) { // Parameter: Route ID
    console.log(" getting driver info",req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(getDriverInfo, [req.query.driver_id], function(err, result) {

            if (err)
             { console.error(err); res.send("Error " + err); }
            else{
            res.json(result.rows[0]);
            done();
            }
        });
    });
});

//get routes names and ids from database and send back to application
router.get('/getRoutes', function(req, res, next) { // Parameter: Route ID
    console.log("getting tim's routes ")
    pg.connect(database_URL, function(err, client, done) {
        client.query(getRoutes, function(err, result) {

            if (err)
             { console.error(err); res.send("Error " + err); }
            else{
            res.json(result.rows);
            console.log(result.rows)
            done();
            }
        });
    });
});


//change driver route, updating on database and sending back driver info to application
router.put('/changeDriverRoute', function(req, res, next) {
    console.log("entre a cambiar ruta de conductor",req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(changeDriverRoute,[req.body.route_id,req.body.bus_id] ,function(err, result) {

            if (err)
             {
                 console.error(err); res.send("Error" + err);
             }
            
            else{
                client.query(getDriverInfo,[req.body.driver_id] ,function(err, result) {

                if (err)
                { 
                    console.error(err); res.send("Error" + err);
                }
                else
                res.json(result.rows[0]);
                done();
            });
            done();
            }
        });
    });
});

//updating bus status on database and then sending back driver info to application
router.put('/updateBusStatus', function(req, res, next) {
    console.log("haciendo update al status del bus", req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(updateBusStatus,[req.body.bus_status,req.body.bus_id] ,function(err, result) {

            if (err)
             { 
                 console.error(err); res.send("Error" + err); 
            }
            else{
                client.query(getDriverInfo,[req.body.driver_id] ,function(err, result) {

                if (err)
                { 
                    console.error(err); res.send("Error" + err);
                }
                else{
                res.json(result.rows[0]);
                done();
                }
            });
            done();
            }
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
    
    console.log("updating bus location",req.body)
    pg.connect(database_URL, function(err, client, done) {
     
        client.query(getDriverBusGPSid,[req.body.driver_id] ,function(err, result) {
            if (err)
             { console.error(err); res.send("Error" + err); }
            else{
            var gps_id = result.rows[0].gps_id
            
                    client.query(updateBusLocation,[req.body.lat,req.body.lng,gps_id] ,function(err, result) {

                    if (err)
                    { console.error(err); res.send("Error" + err); }
                    else
                    res.json({success:1})
                    done();

                    });
            done();
            }

            //Update the localization of the Driver Bus using the bus GPS ID
           
        });
    });
});



//Routes for login/logout
//login driver on system, updatin driver status to "logged in" if credentials are correct
//if credentials are incorrect send -1 back as a response
router.post('/login', function(req, res, next) {
    console.log("entre al login",req.body)
    
    pg.connect(database_URL, function(err, client, done) {
        client.query(checkCredentials,[req.body.username, req.body.password] ,function(err, result) {

            if (err)
             { console.error(err); res.send("Error" + err); }
            else{
             done()
             
             if(result.rows.length==0){
                 res.json({driver_id:-1});
                 done();
             }
             else{
                var driverid=result.rows[0]               
                 pg.connect(database_URL, function(err, client, done) {
                        client.query(login,[req.body.driver_id] ,function(err, result) {

                        if (err)
                            { console.error(err); res.send("Error" + err); }
                        else{
                            done();
                        }
                    });
                });
                console.log("driverid",driverid)
                res.json(driverid)
                done();
             }
            }
            
        });
    });
});
//loging out driver, updting driver status on database
router.put('/logout', function(req, res, next) {
    console.log("login out",req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(logout,[req.body.driver_id] ,function(err, result) {

            if (err)
             { console.error(err); res.send("Error" + err); }
            else{
            res.json({"success":1});
            
            done();
            }
        });
    });
});


module.exports=router;

