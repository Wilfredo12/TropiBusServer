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
var getAllRoutes = 'SELECT * FROM Route'
var getRoute = 'SELECT * FROM Route NATURAL JOIN Path WHERE route_id=$1'
var getAllStops = 'SELECT * FROM Stop' 
var getNearestStop 
var getStopsFromRoute = 'SELECT * FROM Stop WHERE route_id=$1'
var getBusLocation = 'SELECT bus_latitude, bus_longitude FROM Bus NATURAL JOIN GPS'
var getMessages = 'SELECT * FROM Message'
var getBuses = 'SELECT * FROM Bus'


router.get('/getAllRoutes', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(getAllRoutes, function(err, result) {

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

router.get('/getRoute', function(req, res, next) { // Parameter: Route ID
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(getRoute, [req.body.route_id], function(err, result) {

            if (err)
             { console.error(err); response.send("Error " + err); }
            else{
            res.json(result.rows);
            console.log(result.rows)
            done();
            }
        });
    });
});

router.get('/getAllStops', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(getAllStops, function(err, result) {

            if (err)
             { console.error(err); response.send("Error " + err); }
            else{
            res.json(result.rows);
            console.log(result.rows)
            done();
            }
        });
    });
});

router.get('/getStopsFromRoute', function(req, res, next) {//Parameter: Route ID
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(getStopsFromRoute,[req.body.route_ID], function(err, result) {

            if (err)
             { console.error(err); response.send("Error " + err); }
            else{
            res.json(result.rows);
            console.log(result.rows)
            done();
            }
        });
    });
});

router.get('/getBusLocation', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(getBusLocation, function(err, result) {

            if (err)
             { console.error(err); response.send("Error " + err); }
            else{
            res.json(result.rows);
            console.log(result.rows)
            done();
            }
        });
    });
});
//maaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaalllllllllll

router.get('/getMessages', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(getMessages, function(err, result) {

            if (err)
             { console.error(err); response.send("Error " + err); }
            else{
            res.json(result.rows);
            console.log(result.rows)
            done();
            }
        });
    });
});

router.get('/getBuses', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(getBuses, function(err, result) {

            if (err)
             { console.error(err); response.send("Error " + err); }
            else{
            res.json(result.rows);
            console.log(result.rows)
            done();
            }
        });
    });
});



var user1={
    username:"eef",
    password:"Y"
}

router.get("/test",function(req,res){
    console.log(user1)
    res.json(user1);
})


module.exports=router;

