/** 
 * Author: Luis Toro
 * Creation Date: 3/18/2017
 *
 * Description: Contains Bus Tracking app routes and queries 
 * 
 * Routes:
 * /updateRoute 
 * /updateBusDriver
 * 
**/

var express = require("express");
var router= express.Router();
var pg = require("pg");
const database_URL="put url here"
pg.defaults.ssl=true;

// Queries var Declaration.

var updateRoute;
var updateBusDriver;







module.exports=router;