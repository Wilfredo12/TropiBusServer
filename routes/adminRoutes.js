var express = require("express");
var router= express.Router();
var pg = require("pg");

const database_URL="put url here"

pg.defaults.ssl=true;

var user={
    username:"x",
    password:"Y"
}
router.get("/admin_login",function(req,res){
    console.log(user)
    res.json(user);
})

module.exports=router;