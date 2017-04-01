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
var getAllRoutes = 'SELECT * FROM Route NATURAL JOIN routepath' //ok 
var getRoute = 'SELECT * FROM route NATURAL JOIN routepath WHERE route_id = $1' //okx2
var getAllStops = 'SELECT * FROM Stop' //ok
//---------------------------- 
var getStopsFromRoute = 'SELECT * FROM stop_routepath WHERE route_id=$1' //verify n-n realtion 
//---------------------------- 

var getBusLocation = 'SELECT gps_latitude, gps_longitude FROM bus NATURAL JOIN GPS WHERE bus_id = $1' //ok
var getAllMessages = 'SELECT * FROM Message' //ok
var getAllBuses = 'SELECT * FROM Bus'//ok
var getAllDrivers = 'SELECT * FROM driver' //ok


//Routes for Update
var updateStop = 'UPDATE stop SET stop_name=$1, stop_description=$2 WHERE stop_id=$3'//ok
var updateRoute = 'UPDATE Route SET route_name=$1, route_description=$2 WHERE route_id=$3'//ok
var updateBus = 'UPDATE Bus SET bus_name=$1,  WHERE bus_id=$3' //pendiente
var updateDriver = 'UPDATE Driver SET driver_firstname=$1, driver_lastname=$2 WHERE driver_id=$3'//ok
var updateMessage = 'UPDATE message SET message_text=$1 WHERE message_id=$2' 

//Routes for Add
//var addStop = 'INSERT INTO Stop(stop_title, stop_description, stop_latitude, stop_longitude) VALUES (?,?,?,?)'


//Routes for delete
var deleteStop = 'DELETE FROM Stop WHERE stop_id=$1'
var deleteBus = 'DELETE FROM Bus WHERE bus_id=$1'
var deleteMessage = 'DELETE FROM Message WHERE message_id=$1'

//Routes for create
var createDriver = 'INSERT INTO driver(driver_id, driver_firstname, driver_lastname, driver_username, driver_password, driver_status, bus_id) VALUES ($1,$2,$3,$4,$5,$6,$7)'
var createBus = 'INSERT INTO bus(bus_id, bus_name, driver_id, route_id, gps_id) VALUES ($1,$2,$3,$4,$5)'
var createRoute = 'INSERT INTO route(route_id, route_name, route_description) VALUES ($1,$2,$3)'
var createStop = 'INSERT INTO Stop(stop_id,stop_name,stop_description,stop_latitude,stop_longitude)VALUES($1,$2,$3,$4,$5)'
var addMessage = 'INSERT INTO Message(text, message_date) VALUES ($1,$2)'


var adminLogin = ''
var adminLogout = ''

//assgign querties 
var assignBustoDriver = 'UPDATE driver SET bus_id=$1 WHERE driver_id=$2'
var assignRoutetoBus = 'UPDATE bus SET route_id=$1 WHERE bus_id=$2'
var assignGPStoBus = 'UPDATE bus SET gps_id=$1 WHERE bus_id=$2'
var assgignRoutetoPath = 'UPDATE bus SET route_id= $1 WHERE path_id=$2'

var changeDriverStatus = 'UPDATE driver driver_status=$1 WHERE driver_id=1'
var changeBusStatus = 'UPDATE bus SET bus_status=$1 WHERE bus_id=$2'


//Routes for gets 
router.get('/getAllRoute', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(getAllRoutes, function(err, result) {

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

router.get('/getRoute', function(req, res, next) { // Parameter: Route ID
    console.log('Route ID ', req.query.route_id)
    
    pg.connect(database_URL, function(err, client, done) {
        client.query(getRoute, [req.query.route_id], function(err, result) {
                              
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
//probar si la relacion n-n de la base de datos funciona correctamente 

router.get('/getStopsFromRoute', function(req, res, next) {//Parameter: Route ID
    console.log('Route ID', req.query.route_id)
    pg.connect(database_URL, function(err, client, done) {
        client.query(getStopsFromRoute,[req.query.route_id], function(err, result) {

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
    console.log('bus ID', req.query.bus_id)
    pg.connect(database_URL, function(err, client, done) {
        client.query(getBusLocation, [req.query.bus_id],function(err, result) {
                                
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

router.get('/getAllMessages', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(getAllMessages, function(err, result) {

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

router.get('/getAllBuses', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(getAllBuses, function(err, result) {

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

router.get('/getAllDrivers', function(req, res, next) {
    console.log(req.body)
    pg.connect(database_URL, function(err, client, done) {
        client.query(getAllDrivers, function(err, result) {

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

    console.log("Enter to update Stop ",req.query.stop_id)

    pg.connect(database_URL, function(err, client, done) {

        //Update Stop
        client.query(updateStop,[req.query.stop_name, req.query.stop_description, req.query.stop_id] ,function(err, result) {
            if (err)
             { console.error(err); response.send("Error" + err); }

            else{
                client.query(getAllStops, function(err, result){
                
                if(err)
                { console.error(err); response.send("Error " + err); }
                
                else{
                    res.json(result.rows);
                    done();
                 }

            });
            done();
            }
        });
    });
});

router.put('/updateRoute', function(req, res, next) {
    console.log('Route ID ', req.query.route_id)
    console.log('Route Description ', req.query.route_description)
    console.log('Route Name ', req.query.route_name)

    pg.connect(database_URL, function(err, client, done) {
        client.query(updateRoute,[req.query.route_name, req.query.route_description, req.query.route_id] ,function(err, result) {

            if (err)
             { console.error(err); response.send("Error " + err); }
           
            else{
                client.query(getAllRoutes, function(err, result){

                    if(err)
                { console.error(err); response.send("Error " + err); }
                
                else{
                    res.json(result.rows);
                    done();
                 }
            });
            done();
            }
        });
    });
});

router.put('/updateBusAdmin', function(req, res, next) {

    console.log('Bus Name ', req.query.bus_name)
    console.log('Bus bus ID ', req.query.bus_name)
    console.log('Driver Id ', req.query.bus_name)


    pg.connect(database_URL, function(err, client, done) {
        client.query(updateBusAdmin,[res.query.bus_name, res.query.bus_id, req.query.driver_id] ,function(err, result) {

            if (err)
             { console.error(err); response.send("Error " + err); }
            else{
                client.query(getBuses, function(err, result){
                
                if(err)
                { console.error(err); response.send("Error " + err); }
                
                else{
                    res.json(result.rows);
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
    console.log('Mensaje'+req.query.mesagge_text, 'ID del mensaje '+ req.query.mesagge_id)
    pg.connect(database_URL, function(err, client, done) {
        client.query(updateMessage,[req.query.message_text, req.query.message_id] ,function(err, result) {

           if (err)
             { console.error(err); response.send("Error " + err); }
            else{
                client.query(getAllMessages, function(err, result){
                
                if(err)
                { console.error(err); response.send("Error " + err); }
                
                else{
                    res.json(result.rows);
                    done();
                 }
            });
            done();
            }
        });
    });
});


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



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/createDriver', function(req, res, next) {
    console.log('Driver ID ', req.query.driver_id)
    pg.connect(database_URL, function(err, client, done) {
        client.query(createDriver,[req.query.driver_id,req.query.driver_firstname, req.query.driver_lastname,req.query.driver_username,req.query.driver_password,req.query.driver_status, req.query.bus_id] ,function(err, result) {

           if (err)
             { console.error(err); response.send("Error " + err); }
            else{
                client.query(getAllDrivers, function(err, result){
                
                if(err)
                { console.error(err); response.send("Error " + err); }
                
                else{
                    res.json(result.rows);
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
        client.query(createBus,[req.query.bus_name, req.query.driver_id, req.query.route_id, req.query.gps_id] ,function(err, result) {

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
        client.query(deleteStop,[req.query.stop_id] ,function(err, result) {

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
        client.query(deleteBus,[res.querty.bus_id] ,function(err, result) {

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
        client.query(deleteMessage,[req.query.message_id] ,function(err, result) {

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


// var user={
//     username:"y",
//     password:"z"
// }

// router.get("/test",function(req,res){
//     console.log(user)
//     res.json(user);
// });

module.exports=router;

