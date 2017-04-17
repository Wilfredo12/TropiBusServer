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

//Routes for gets okk
var getAllRoutes = 'SELECT * FROM Route NATURAL JOIN routepath' //ok 
var getRoute = 'SELECT * FROM route NATURAL JOIN routepath WHERE route_id = $1' //okx2
var getAllStops = 'SELECT * FROM Stop' //ok

var getStopsFromRoute = 'SELECT * FROM route_stop NATURAL JOIN stop NATURAL JOIN route WHERE route_id=$1' //verify n-n realtion 


var getBusLocation = 'SELECT gps_latitude, gps_longitude FROM bus NATURAL JOIN GPS WHERE bus_id = $1' //ok
var getAllMessages = 'SELECT * FROM Message' //ok
var getAllBuses = 'SELECT * FROM Bus'//ok
var getAllDrivers = 'SELECT * FROM driver' //ok


//Routes for Update
var updateStop = 'UPDATE stop SET stop_name=$1, stop_description=$2, stop_latitude=$3, stop_longitude=$4 WHERE stop_id=$3'//ok
var updateRoute = 'UPDATE Route SET route_name=$1, route_description=$2, route_area=$3 WHERE route_id=$4'//ok
var updateBus = 'UPDATE Bus SET bus_name=$1  WHERE bus_id=$2' //ok
var updateDriver = 'UPDATE Driver SET driver_firstname=$1, driver_lastname=$2 WHERE driver_id=$3'//ok
var updateMessage = 'UPDATE message SET message_text=$1, message_title = $2 WHERE message_id=$3' //ok

//Routes for Add
//var addStop = 'INSERT INTO Stop(stop_title, stop_description, stop_latitude, stop_longitude) VALUES (?,?,?,?)'


//Routes for delete
var deleteStop = 'DELETE FROM Stop WHERE stop_id=$1'
var deleteBus = 'DELETE FROM Bus WHERE bus_id=$1 RETURNING gps_id'
var deleteMessage = 'DELETE FROM Message WHERE message_id=$1'
var deleteDriver = 'DELETE FROM driver WHERE driver_id = $1'
var deleteRoute = 'DELETE FROM route WHERE route_id = $1'
var deleteGPS = 'DELETE FROM gps WHERE gps_id = $1'

//Routes for create
var createDriver = 'INSERT INTO driver(driver_firstname, driver_lastname, driver_username, driver_password) VALUES ($1,$2,$3,$4)'//ok
var createBus = 'INSERT INTO bus(bus_name,  gps_id, bus_status) VALUES ($1,$2, $3)'///////////////////////////////
var createRoute = 'INSERT INTO route(route_name, route_description) VALUES ($1,$2)'
var createStop = 'INSERT INTO Stop(stop_name,stop_description,stop_latitude,stop_longitude) VALUES($1,$2,$3,$4) RETURNING stop_id '//ok route_id
var addMessage = 'INSERT INTO Message(admin_id, message_text, message_date, message_title) VALUES ($1,$2, $3, $4)' //ok

var createGPS =  'INSERT INTO GPS(gps_latitude, gps_longitude) VALUES(0,0) RETURNING gps_id'

var asignStopToRoute = 'INSERT INTO route_stop(route_id, stop_id) VALUES($1,$2)'

//Routes for login/logout 
var checkCredentials= "SELECT admin_id FROM administrator WHERE admin_username=$1 and admin_password=$2"
// var login = 'UPDATE admin SET driver_status = \'logged\' WHERE driver_id = $1'
// var logout = 'UPDATE driver SET driver_status = \'not logged\' WHERE driver_id = $1'

//assgign querties 
var assignBustoDriver = 'UPDATE driver SET bus_id=$1 WHERE driver_id=$2'
var assignRoutetoBus = 'UPDATE bus SET route_id=$1 WHERE bus_id=$2'
var assignGPStoBus = 'UPDATE bus SET gps_id=$1 WHERE bus_id=$2'
var assgignRoutetoPath = 'UPDATE bus SET route_id= $1 WHERE path_id=$2'
var changeDriverStatus = 'UPDATE driver driver_status=$1 WHERE driver_id=1'
var changeBusStatus = 'UPDATE bus SET bus_status=$1 WHERE bus_id=$2'




//Routes for gets 
router.get('/getAllRoute', function(req, res, next) {
    console.log('Print all stored routes in JSON format')
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

    console.log('Print an specific route and path in JSON format')
    console.log('Route ID: ', req.query.route_id)
    
    pg.connect(database_URL, function(err, client, done) {
        client.query(getRoute, [req.query.route_id], function(err, result) {
                              
            console.log('ENTRE A GET ROUTE')

            if (err)
             { console.error(err); response.send("Error " + err); }
            else{
            res.json(result.rows);
            //console.log(result.rows)
        
            done();
            }
        });
    });
});

router.get('/getAllStops', function(req, res, next) {
    console.log('Print all stored stops in JSON format')
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
    console.log('Print all Stopf from a specific route')
    console.log('Route ID: ', req.query.route_id)
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
    console.log('Print actual bus location in JSON format using the bus ID')
    console.log('bus ID: ', req.query.bus_id)
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
    console.log('Print all stored messages in JSON format')
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
    console.log('Print all stored buses in JSON format')
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
    console.log('Print all drivers in JSON format')
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


    console.log('Update Stop with '+req.query.stop_id+' ID')
    console.log('Set stop_name = ' +req.query.stop_name)
    console.log('Set stop_description = '+req.query.stop_description)
    console.log('Set stop_ID = '+ req.query.stop_id)

    pg.connect(database_URL, function(err, client, done) {

        //Update Stop
        client.query(updateStop,[req.query.stop_name, req.query.stop_description,req.query.stop_latitude, req.query.stop_longitude, req.query.stop_id] ,function(err, result) {
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

    console.log('Update route with '+req.query.route_id+ ' ID')
    console.log('Route ID ', req.query.route_id)
    console.log('Route Description ', req.query.route_description)
    console.log('Route Name ', req.query.route_name)

    pg.connect(database_URL, function(err, client, done) {
        client.query(updateRoute,[req.query.route_name, req.query.route_description,req.query.route_area, req.query.route_id] ,function(err, result) {

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

router.put('/updateBus', function(req, res, next) {

    console.log('Bus Name ', req.query.bus_name)
    console.log('Bus bus ID ', req.query.bus_id)
 

    pg.connect(database_URL, function(err, client, done) {
        client.query(updateBus,[req.query.bus_name, req.query.bus_id] ,function(err, result) {

            if (err)
             { console.error(err); response.send("Error " + err); }
            else{
                client.query(getAllBuses, function(err, result){
                
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
    
    console.log('Update driver ID'+req.query.driver_id)
    console.log('Set Driver Name: ', req.query.driver_firstname)
    console.log('Set Driver lastname: ', req.query.driver_lastname)

    pg.connect(database_URL, function(err, client, done) {
        client.query(updateDriver,[req.query.driver_firstname, req.query.driver_lastname, req.query.driver_id] ,function(err, result) {

            if (err)
             { console.error(err); res.send("Error " + err); }
            else{
                client.query(getAllDrivers, function(err, result){
                
                if(err)
                { console.error(err); res.send("Error " + err); }
                
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

router.put('/updateMessage', function(req, res, next) {
    console.log('Mensaje'+req.query.mesagge_text, 'ID del mensaje '+ req.query.mesagge_id)
    pg.connect(database_URL, function(err, client, done) {
        client.query(updateMessage,[req.query.message_text, req.query.message_title, req.query.message_id] ,function(err, result) {

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

router.put('/assignBustoDriver', function(req, res, next) {

    pg.connect(database_URL, function(err, client, done) {
        client.query(assignBustoDriver,[req.query.bus_id,req.query.driver_id] ,function(err, result) {

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


router.put('/assignRoutetoBus', function(req, res, next) {

    pg.connect(database_URL, function(err, client, done) {
        client.query(assignRoutetoBus,[req.query.route_id,req.query.bus_id] ,function(err, result) {

           if (err)
             { console.error(err); response.send("Error " + err); }
            else{
                client.query(getAllBuses, function(err, result){
                
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

////

// router.put('/assignGPStoBus', function(req, res, next) {

//     pg.connect(database_URL, function(err, client, done) {
//         client.query(assignGPStoBus,[req.query.route_id,req.query.bus_id] ,function(err, result) {

//            if (err)
//              { console.error(err); response.send("Error " + err); }
//             else{
//                 client.query(getAllBuses, function(err, result){
                
//                 if(err)
//                 { console.error(err); response.send("Error " + err); }
                
//                 else{
//                     res.json(result.rows);
//                     done();
//                  }
//             });
//             done();
//             }
//         });
//     });
// });

router.put('/changeBusStatus', function(req, res, next) {

    pg.connect(database_URL, function(err, client, done) {
        client.query(changeBusStatus,[req.query.bus_status,req.query.bus_id] ,function(err, result) {

           if (err)
             { console.error(err); response.send("Error " + err); }
            else{
                client.query(getAllBuses, function(err, result){
                
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

router.put('/changeRouteStatus', function(req, res, next) {

    pg.connect(database_URL, function(err, client, done) {
        client.query(changeRouteStatus,[req.query.route_status,req.query.route_id] ,function(err, result) {

           if (err)
             { console.error(err); response.send("Error " + err); }
            else{
                client.query(getAllBuses, function(err, result){
                
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


router.put('/assgignRoutetoPath', function(req, res, next) {

    pg.connect(database_URL, function(err, client, done) {
        client.query(assgignRoutetoPath,[req.query.route_id,req.query.path_id] ,function(err, result) {

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



//Routes for Add

router.post('/createStop', function(req, res, next) {

    console.log('CREATE STOP')
    console.log('Stop Name '+req.query.stop_name)
    console.log('Stop Description ', req.query.stop_description)
    console.log('Stop Latitude ', req.query.stop_latitude)
    console.log('Stop Longitude ', req.query.stop_longitude)

    console.log('route ID', req.query.route_id)

    var stopID
    var routeID 

    pg.connect(database_URL, function(err, client, done) {
        client.query(createStop,[req.query.stop_name ,req.query.stop_description, req.query.stop_latitude, req.query.stop_longitude] ,function(err, result) {
            
            stopID = result.rows[0].stop_id
                console.log('Stop ID '+ stopID)

            routeID = req.query.route_id

            if (err)
             { console.error(err); response.send("Error " + err); }
            else{
                client.query(asignStopToRoute, [routeID, stopID], function(err, result){
                
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

router.post('/addMessage', function(req, res, next) {


     console.log('CREATE MESSAGE')

    console.log('Message text '+req.query.message_text)
    console.log('Message date', req.query.message_date)
    console.log('Message Title ', req.query.message_title)
     console.log('Admin ID ', req.query.admin_id)

    pg.connect(database_URL, function(err, client, done) {
        client.query(addMessage,[req.query.admin_id,req.query.message_text, req.query.message_date,req.query.message_title] ,function(err, result) {

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


router.post('/createDriver', function(req, res, next) {

    console.log('Create Driver')
    console.log('Firstname: ', req.query.driver_firstname)
    console.log('lastnameD ', req.query.driver_lastname)
    console.log('username ', req.query.driver_username)
    console.log('password ', req.query.driver_password)
    console.log('status ', req.query.driver_status)
    console.log('Bus id ', req.query.bus_id)
        

    pg.connect(database_URL, function(err, client, done) {
        client.query(createDriver,[req.query.driver_firstname, req.query.driver_lastname,req.query.driver_username,req.query.driver_password] ,function(err, result) {

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
    console.log('Create a bus')
    //console.log(req.query.)
    var id = 0
    var status
    pg.connect(database_URL, function(err, client, done) {
         
         client.query(createGPS, function(err, result) {

            id = result.rows[0].gps_id
            status = 'inactive'

             console.log("GPS ID" , id)

            if (err)
             { console.error(err); response.send("Error " + err); }
            else{
                client.query(createBus,[req.query.bus_name, id, status] ,function(err, result){

                     if(err)
                { console.error(err); response.send("Error " + err); }
                
                else{
                    res.json(result.rows);
                    done();
                 }
            });
            done();
            }
                
            //     if(err)
            //     { console.error(err); response.send("Error " + err); }

            //         else{
            //         client.query(getAllBuses ,function(err, result){
                    
            //             if(err)
            //             { console.error(err); response.send("Error " + err); }
                        
            //                 else{
            //                     res.json(result.rows);
            //                     done();
            //                 }
            //         });
            //         done();
            //     }
            // });
            // done();
            // }
        });
    });
});



//Routes for delete

router.delete('/deleteStop', function(req, res, next) {
    console.log('DELETE STOP')
    console.log('Stop ID' ,req.query.stop_id)
    pg.connect(database_URL, function(err, client, done) {
        client.query(deleteStop,[req.query.stop_id] ,function(err, result) {

             if (err)
             { console.error(err); response.send("Error " + err); }
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


router.delete('/deleteBus', function(req, res, next) {
    console.log('Bus ID ' ,req.query.bus_id)

    var id
    pg.connect(database_URL, function(err, client, done) {
        client.query(deleteBus,[req.query.bus_id] ,function(err, result) {

            id = result.rows[0].gps_id

             if (err)
             { console.error(err); response.send("Error " + err); }
            else{
                client.query(deleteGPS,[id], function(err, result){
                
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



router.delete('/deleteMessage', function(req, res, next) {
    console.log(req.query.mesagge_id)
    pg.connect(database_URL, function(err, client, done) {
        client.query(deleteMessage,[req.query.message_id] ,function(err, result) {

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


router.get('/login', function(req, res, next) {
    console.log("entre al login")

    console.log("User",req.query.admin_username)
    console.log("User",req.query.admin_password)

    pg.connect(database_URL, function(err, client, done) {
        client.query(checkCredentials,[req.query.admin_username, req.query.admin_password] ,function(err, result) {

            if (err)
             { console.error(err); res.send("Error" + err); }
           
            else{
             done()
             
             if(result.rows.length==0){
                 res.json({admin:-1});
                 done();
             }

             else{
                var driverid=result.rows[0]               
                console.log("admin ID",driverid)
                res.json(driverid)
                done();
             }
            }
            
        });
    });
});

//loging out driver, updting driver status on database
// router.put('/logout', function(req, res, next) {
//     console.log("login out",req.body)
//     pg.connect(database_URL, function(err, client, done) {
//         client.query(logout,[req.body.driver_id] ,function(err, result) {

//             if (err)
//              { console.error(err); res.send("Error" + err); }
//             else{
//             res.json({"success":1});
            
//             done();
//             }
//         });
//     });
// });


// var user={
//     username:"y",
//     password:"z"
// }

// router.get("/test",function(req,res){
//     console.log(user)
//     res.json(user);
// });

module.exports=router;

