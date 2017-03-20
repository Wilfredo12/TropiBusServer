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
const database_URL=  'postgres://wymxggcwikpwav:203bccfd54e249de1659cdcb1d99cac0f82a14eb9246b51bbef0c1598c46089d@ec2-54-83-205-71.compute-1.amazonaws.com:5432/dd0arpc8l5k2be'
pg.defaults.ssl=true;

//Routes for gets
var getAllRoutes = 'SELECT * FROM Route'
var getRoute = 'SELECT * FROM Route WHERE route_ID=$1'
var getAllStops = 'SELECT * FROM Stop' 
var getNearestStop 
var getStopsFromRoute = 'SELECT * FROM Stop WHERE route_ID=$1'
var getBusLocation = 'SELECT bus_latitude, bus_longitude FROM Bus NATURAL JOIN GPS'
var getMessages = 'SELECT * FROM Message'
var getBuses = 'SELECT * FROM Bus'

//Routes for Update
var updateStop = 'UPDATE Stop SET stop_name=$1, stop_description=$2 WHERE stop_ID=$3'
var updateRoute = 'UPDATE Route SET route_name=$1, route_description=$2 WHERE route_ID=$3'
var updateBusAdmin = 'UPDATE Bus SET bus_name=$1, driver_ID=$2 WHERE bus_ID=$3'
var updateDriver = 'UPDATE Driver SET first_name=$1, last_name=$2 WHERE driver_ID=$3'
var updateMessage = 'UPDATE Message SET text=$1 WHERE message_ID=$2' 

//Routes for Add
//var addStop = 'INSERT INTO Stop(stop_title, stop_description, stop_latitude, stop_longitude) VALUES (?,?,?,?)'
var addMessage = 'INSERT INTO Message(text, message_date_added) VALUES ($1,$2)'

//Routes for delete
var deleteStop = 'DELETE FROM Stop WHERE stop_ID=$1'
var deleteBus = 'DELETE FROM Bus WHERE bus_ID=$1'
var deleteMessage = 'DELETE FROM Message WHERE message_ID=$1'

//Routes for create
var createDriver = 'INSERT INTO Driver(diver_ID, driver_first_name, driver_last_name, driver_user_name, driver_password, driver-status) VALUES ($1,$2,$3,$4,$5,$6)'
var createBus = 'INSERT INTO Bus(bus_name, driver_ID, route_ID, gps_ID) VALUES ($1,$2,$3,$4)'
var createRoute = ''
var createStop = 'INSERT INTO Stop(stop_title, stop_description, stop_latitude, stop_longitude) VALUES ($1,$2,$3,$4)'


//Routes for gets 
router.get('/getAllRoutes', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(getAllRoutes, function(err, result) {

            if (err)
             { console.error(err); response.send("Error ekc sdskdvskvdskvsvdsk" + err); }
            else
            res.json(result.rows);
            console.log(result.rows)
            done();
        });
    });
});

router.get('/getRoute', function(req, res, next) { // Parameter: Route ID
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(getRoute, [req.body.route_ID], function(err, result) {

            if (err)
             { console.error(err); response.send("Error " + err); }
            else
            res.json(result.rows);
            console.log(result.rows)
            done();
        });
    });
});

router.get('/getAllStops', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(getAllStops, function(err, result) {

            if (err)
             { console.error(err); response.send("Error " + err); }
            else
            res.json(result.rows);
            console.log(result.rows)
            done();
        });
    });
});

router.get('/getStopsFromRoute', function(req, res, next) {//Parameter: Route ID
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(getStopsFromRoute,[req.body.route_ID], function(err, result) {

            if (err)
             { console.error(err); response.send("Error " + err); }
            else
            res.json(result.rows);
            console.log(result.rows)
            done();
        });
    });
});

router.get('/getBusLocation', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(getBusLocation, function(err, result) {

            if (err)
             { console.error(err); response.send("Error " + err); }
            else
            res.json(result.rows);
            console.log(result.rows)
            done();
        });
    });
});

router.get('/getMessages', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(getMessages, function(err, result) {

            if (err)
             { console.error(err); response.send("Error " + err); }
            else
            res.json(result.rows);
            console.log(result.rows)
            done();
        });
    });
});

router.get('/getBuses', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(getBuses, function(err, result) {

            if (err)
             { console.error(err); response.send("Error " + err); }
            else
            res.json(result.rows);
            console.log(result.rows)
            done();
        });
    });
});


//Routes for Update

router.put('/updateStop', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(updateStop,[res.body.stop_name, res.body.stop_description, stop_ID] ,function(err, result) {

            if (err)
             { console.error(err); response.send("Error ekc sdskdvskvdskvsvdsk" + err); }
            else
            res.json(result.rows);
            console.log(result.rows)
            done();
        });
    });
});

router.put('/updateRoute', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(updateRoute,[res.body.route_name, res.body.route_description, route_ID] ,function(err, result) {

            if (err)
             { console.error(err); response.send("Error ekc sdskdvskvdskvsvdsk" + err); }
            else
            res.json(result.rows);
            console.log(result.rows)
            done();
        });
    });
});

router.put('/updateBusAdmin', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(updateBusAdmin,[res.body.bus_name, res.body.bus_ID, driver_ID] ,function(err, result) {

            if (err)
             { console.error(err); response.send("Error ekc sdskdvskvdskvsvdsk" + err); }
            else
            res.json(result.rows);
            console.log(result.rows)
            done();
        });
    });
});

router.put('/updateDriver', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(updateDriver,[res.body.first_name, res.body.last_name, driver_ID] ,function(err, result) {

            if (err)
             { console.error(err); response.send("Error ekc sdskdvskvdskvsvdsk" + err); }
            else
            res.json(result.rows);
            console.log(result.rows)
            done();
        });
    });
});

router.put('/updateMessage', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(updateMessage,[res.body.mesagge_text, message_ID] ,function(err, result) {

            if (err)
             { console.error(err); response.send("Error ekc sdskdvskvdskvsvdsk" + err); }
            else
            res.json(result.rows);
            console.log(result.rows)
            done();
        });
    });
});

//Falta el de crear ruta

//Routes for Add

router.post('/createStop', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(createStop,[res.body.stop_title, res.body.stop_description, res.body.stop_latitude, res.body.stop_longitude] ,function(err, result) {

            if (err)
             { console.error(err); response.send("Error ekc sdskdvskvdskvsvdsk" + err); }
            else
            res.json(result.rows);
            console.log(result.rows)
            done();
        });
    });
});

router.post('/addMessage', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(addMessage,[res.body.mesagge_text, res.body.message_date_added] ,function(err, result) {

            if (err)
             { console.error(err); response.send("Error ekc sdskdvskvdskvsvdsk" + err); }
            else
            res.json(result.rows);
            console.log(result.rows)
            done();
        });
    });
});

router.post('/createDriver', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(createDriver,[res.body.driver_ID,res.body.driver_first_name, res.body.driver_last_name,res.body.driver_first_name,res.body.driver_last_name,res.body.driver_status] ,function(err, result) {

            if (err)
             { console.error(err); response.send("Error ekc sdskdvskvdskvsvdsk" + err); }
            else
            res.json(result.rows);
            console.log(result.rows)
            done();
        });
    });
});

router.post('/createBus', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(createBus,[res.body.bus_name, res.body.driver_ID, res.body.route_ID, res.body.gps_ID] ,function(err, result) {

            if (err)
             { console.error(err); response.send("Error ekc sdskdvskvdskvsvdsk" + err); }
            else
            res.json(result.rows);
            console.log(result.rows)
            done();
        });
    });
});

router.post('/createStop', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(createStop,[res.body.stop_title, res.body.stop_description, res.body.stop_latitude, res.body.stop_longitude] ,function(err, result) {

            if (err)
             { console.error(err); response.send("Error ekc sdskdvskvdskvsvdsk" + err); }
            else
            res.json(result.rows);
            console.log(result.rows)
            done();
        });
    });
});


//Routes for delete

router.delete('/deleteStop', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(deleteStop,[stop_ID] ,function(err, result) {

            if (err)
             { console.error(err); response.send("Error ekc sdskdvskvdskvsvdsk" + err); }
            else
            res.json(result.rows);
            console.log(result.rows)
            done();
        });
    });
});

router.delete('/deleteBus', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(deleteBus,[bus_ID] ,function(err, result) {

            if (err)
             { console.error(err); response.send("Error ekc sdskdvskvdskvsvdsk" + err); }
            else
            res.json(result.rows);
            console.log(result.rows)
            done();
        });
    });
});


router.delete('/deleteMessage', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(deleteMessage,[message_ID] ,function(err, result) {

            if (err)
             { console.error(err); response.send("Error ekc sdskdvskvdskvsvdsk" + err); }
            else
            res.json(result.rows);
            console.log(result.rows)
            done();
        });
    });
});



var user={
    username:"y",
    password:"z"
}

router.get("/test",function(req,res){
    console.log(user)
    res.json(user);
})

module.exports=router;
