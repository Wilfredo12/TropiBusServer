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
var getAllRoutes = 'SELECT * FROM Route NATURAL JOIN routepath'
var getRoute = 'SELECT * FROM route NATURAL JOIN routepath WHERE route_id = $1'
var getAllStops = 'SELECT * FROM Stop' 
var getNearestStop 
var getStopsFromRoute = 'SELECT * FROM stop WHERE route_id=$1'
var getBusLocation = 'SELECT bus_latitude, bus_longitude FROM Bus NATURAL JOIN GPS WHERE bus_id = $1' 
var getMessages = 'SELECT * FROM Message'
var getBuses = 'SELECT * FROM Bus'
var getAllDrivers = 'SELECT * FROM driver'


var getAdmin = 'SELECT * FROM administrator WHERE admin_id=$1'

//Routes for Update
var updateStop = 'UPDATE Stop SET stop_name=$1, stop_description=$2 WHERE stop_id=$3'
var updateRoute = 'UPDATE Route SET route_name=$1, route_description=$2 WHERE route_id=$3'
var updateBusAdmin = 'UPDATE Bus SET bus_name=$1, driver_id=$2 WHERE bus_id=$3'
var updateDriver = 'UPDATE Driver SET driver_firstname=$1, driver_lastname=$2 WHERE driver_id=$3'
var updateMessage = 'UPDATE Message SET text=$1 WHERE message_id=$2' 

//Routes for Add
//var addStop = 'INSERT INTO Stop(stop_title, stop_description, stop_latitude, stop_longitude) VALUES (?,?,?,?)'
var addMessage = 'INSERT INTO Message(text, message_date_added) VALUES ($1,$2)'

//Routes for delete
var deleteStop = 'DELETE FROM Stop WHERE stop_id=$1'
var deleteBus = 'DELETE FROM Bus WHERE bus_id=$1'
var deleteMessage = 'DELETE FROM Message WHERE message_id=$1'

//Routes for create
var createDriver = 'INSERT INTO driver(driver_id, driver_firstname, driver_lastname, driver_username, driver_password, driver_status, bus_id) VALUES ($1,$2,$3,$4,$5,$6,$7)'
var createBus = 'INSERT INTO bus(bus_name, driver_id, route_id, gps_id) VALUES ($1,$2,$3,$4)'
var createRoute = 'INSERT INTO route(route_id, route_name, route_description) VALUES ($1,$2,$3)'

var createStop = 'INSERT INTO Stop(stop_id,stop_name,stop_description,stop_latitude,stop_longitude)VALUES($1,$2,$3,$4,$5)'

//var getAdmin = 'SELECT * FROM administrator WHERE admin_id=$1'


//Routes for gets 
router.get('/getAllRoutes', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(getAllRoutes, function(err, result) {

            if (err)
             { console.error(err); response.send("Error ekc " + err); }
            else{
            res.json(result.rows);
            console.log(result.rows)
            done();
            }
        });
    });
});

router.get('/getRoute', function(req, res, next) { // Parameter: Route ID
    console.log('Route ID' + req.body)
    
    pg.connect(database_URL, function(err, client, done) {
        client.query(getRoute, [req.body.route_id], function(err, result) {


            console.log('ENTRE A GET ROUTE')

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
            else
            res.json(result.rows);
            console.log(result.rows)
            done();
        });
    });
});


/////////////////////////////////////////////

router.get('/getStopsFromRoute', function(req, res, next) {//Parameter: Route ID
    console.log('Route ID', req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(getStopsFromRoute,[req.body.route_id], function(err, result) {

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
        client.query(getBusLocation, [req.body.driver_id],function(err, result) {

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


//Routes for Update

router.put('/updateStop', function(req, res, next) {
    console.log("Enter to update Stop",req.body)
    pg.connect(database_URL, function(err, client, done) {

        //Update Stop
        client.query(updateStop,[req.body.stop_name, req.body.stop_description, req.body.stop_id] ,function(err, result) {
            if (err)
             { console.error(err); response.send("Error" + err); }

            else{
                client.query(getAllStops, function(err, result){
                
                if(err)
                { console.error(err); response.send("Error " + err); }
                
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

router.put('/updateRoute', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(updateRoute,[req.body.route_name, req.body.route_description,req.body.route_id] ,function(err, result) {

            if (err)
             { console.error(err); response.send("Error ekc sdskdvskvdskvsvdsk" + err); }
           
            else{

                client.query(getAllRoutes, function(err, result){

                    if(err)
                    { console.error(err); res.send("Error" + err); } 
                    else
                    res.jason(result.rows[0]);
                    done();
                });
                done();
                }
            res.json(result.rows);
            done();
        });
    });
});

router.put('/updateBusAdmin', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(updateBusAdmin,[res.body.bus_name, res.body.bus_id, req.body.river_id] ,function(err, result) {

            if (err)
             { console.error(err); response.send("Error " + err); }
            else{
                client.query(getBuses, function(err, result){
                
                if(err)
                { console.error(err); response.send("Error " + err); }
                
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

router.put('/updateDriver', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(updateDriver,[req.body.driver_firstname, req.body.last_name, req.body.driver_id] ,function(err, result) {

            if (err)
             { console.error(err); res.send("Error " + err); }
            else{
                client.query(getAllDrivers, function(err, result){
                
                if(err)
                { console.error(err); res.send("Error " + err); }
                
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

router.put('/updateMessage', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(updateMessage,[rereq.body.mesagge_text, req.body.message_id] ,function(err, result) {

           if (err)
             { console.error(err); response.send("Error " + err); }
            else{
                client.query(getMessages, function(err, result){
                
                if(err)
                { console.error(err); response.send("Error " + err); }
                
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

//Falta el de crear ruta

//Routes for Add

router.post('/createStop', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(createStop,[req.body.stop_id,stop_name ,req.body.stop_description, req.body.stop_latitude, req.body.stop_longitude] ,function(err, result) {
            
            
            if (err)
             { console.error(err); response.send("Error " + err); }
            else{
                client.query(getAllStops, function(err, result){
                
                if(err)
                { console.error(err); response.send("Error " + err); }
                
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

router.post('/addMessage', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(addMessage,[req.body.mesagge_text, req.body.message_date_added] ,function(err, result) {

            if (err)
             { console.error(err); response.send("Error " + err); }
            else{
                client.query(getMessages, function(err, result){
                
                if(err)
                { console.error(err); response.send("Error " + err); }
                
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

router.post('/createDriver', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(createDriver,[req.body.driver_id,req.body.driver_firstname, req.body.driver_lastname,req.body.driver_username,req.body.driver_password,req.body.driver_status, req.body.bus_id] ,function(err, result) {

           if (err)
             { console.error(err); response.send("Error " + err); }
            else{
                client.query(getAllDrivers, function(err, result){
                
                if(err)
                { console.error(err); response.send("Error " + err); }
                
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

router.post('/createBus', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(createBus,[req.body.bus_name, req.body.driver_id, req.body.route_id, req.body.gps_id] ,function(err, result) {

            if (err)
             { console.error(err); response.send("Error " + err); }
            else{
                client.query(getBuses, function(err, result){
                
                if(err)
                { console.error(err); response.send("Error " + err); }
                
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


//Routes for delete

router.delete('/deleteStop', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(deleteStop,[req.body.stop_id] ,function(err, result) {

             if (err)
             { console.error(err); response.send("Error " + err); }
            else{
                client.query(getAllStops, function(err, result){
                
                if(err)
                { console.error(err); response.send("Error " + err); }
                
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


router.delete('/deleteBus', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(deleteBus,[res.bod.bus_id] ,function(err, result) {

             if (err)
             { console.error(err); response.send("Error " + err); }
            else{
                client.query(getBuses, function(err, result){
                
                if(err)
                { console.error(err); response.send("Error " + err); }
                
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



router.delete('/deleteMessage', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(deleteMessage,[re.body.message_id] ,function(err, result) {

            if (err)
             { console.error(err); response.send("Error " + err); }
            else{
                client.query(getMessages, function(err, result){
                
                if(err)
                { console.error(err); response.send("Error " + err); }
                
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



///////////////////////////////////////testing route////////////////////////////////////

// router.get('/getAdmin', function(req, res, next) {
//     console.log(req.body)
//     pg.connect(database_URL, function(err, client, done) {
//         client.query(getAdmin,[1], function(err, result) {
//             console.log("try to get administrator")
            
//             if (err)
//             { console.error(err); response.send("Error " + err); }
//             else
//             res.json(result.rows);
//             console.log(result.rows)
//             done();
//         });
//     });
//  });









// var user={
//     username:"y",
//     password:"z"
// }

// router.get("/test",function(req,res){
//     console.log(user)
//     res.json(user);
// });

module.exports=router;

