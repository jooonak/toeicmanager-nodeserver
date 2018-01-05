var express = require('express');
var router = express.Router();
var firebase = require("firebase");
var admin = require("firebase-admin");
var fetch = require("node-fetch");
var mysql = require("mysql");
var schedule = require('node-schedule');

schedule.scheduleJob('* 1 2 * * 1-7', function () {
    sendNotification();
});

function sendNotification() {

    var con = mysql.createConnection({
        host: "192.168.0.29",
        user: "java96",
        password: "java96",
        database : 'toeicmanager_db'
    });

    var sql = "";

    con.query(sql, function (err, result) {
        if (err) throw err;

        console.log("success");
        console.log(result);
    });

};

module.exports = router;