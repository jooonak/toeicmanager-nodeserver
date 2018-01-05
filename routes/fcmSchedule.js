var express = require('express');
var router = express.Router();
var firebase = require("firebase");
var admin = require("firebase-admin");
var fetch = require("node-fetch");
var mysql = require("mysql");
var schedule = require('node-schedule');

var config = {
    host: "192.168.0.29",
    user: "java96",
    password: "java96",
    database : 'toeicmanager_db'
};

var con;

var key = 'AAAApAY6imo:APA91bH4XjOyE6g2vcDRb5v-h7ocuWn2xn4ksoxHCmQmyhLOKDAYZoErSrimkQtZRDgp23KhB3_vWSmgEBGC7HEVFjeIcfhIJV2M6JQ0IrvZrUh1hgfkjfRuY-kt5acuYRJBMaxASimV';

schedule.scheduleJob("0 2 1 * * *", function () {
    sendNotification();
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', new Date() );
});

function handleDisconnect() {
    con = mysql.createConnection(config);

    con.connect(function (err) {
        if (err) {
            console.log('error when connecting to db: ', err);
            setTimeout(handleDisconnect, 2000);
        }
    });

    con.on('error', function (err) {
       console.log('db error: ', err);
       if (err.code === 'PROTOCOL_CONNECTION_LOST') {
           handleDisconnect();
       } else {
           throw err;
       }
    });
}

function sendNotification() {

    handleDisconnect();

    var sql = "select pusham, pushpm, pushtoken from tbl_member";

    con.query(sql, function (err, result) {
        if (err) throw err;

        for (var i = 0; i < result.length; i++) {

            var now = new Date().getHours() * 3600 + new Date().getMinutes() * 60 + new Date().getSeconds();

            var token = result[i].pushtoken;

            var timeArr = [];
            var converedTime = [];

            timeArr.push(result[i].pusham);

            var arr = (timeArr[0]).split(":");
            converedTime.push(arr[0] * 3600 + arr[1] * 60 + parseInt(arr[2]));

            timeArr.push(result[i].pushpm);

            arr = (timeArr[1]).split(":");
            converedTime.push(arr[0] * 3600 + arr[1] * 60 + parseInt(arr[2]));

            console.log('converedTime.... ' , converedTime);

            var am = converedTime[0];
            var pm = converedTime[1];
            setTimeout(function () { pushNotification(token, "오전 학습을 시작할 시간입니다. 오전 학습을 진행해 주세요") }, (am - now) * 1000);
            setTimeout(function () { pushNotification(token, "오후 학습을 시작할 시간입니다. 오후 학습을 진행해 주세요") }, (pm - now) * 1000);
        }
    });

    function pushNotification(registrationTokens, text) {

        var payload = {
            notification : {
                title: 'REMEMBER ME',
                body: text,
                sound : "default",
                click_action : "FCM_PLUGIN_ACTIVITY"
            }
        };

        admin.messaging().sendToDevice(registrationTokens, payload)
            .then(function(res) {
                // See the MessagingDevicesResponse reference documentation for
                // the contents of response.
                console.log("Successfully sent message:", res);
            })
            .catch(function(error) {
                console.log("Error sending message:", error);
            });

        fetch('https://fcm.googleapis.com/fcm/send', {
            'method': 'POST',
            'headers': {
                'Authorization': 'key=' + key,
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify({
                'notification': payload,
                'to': registrationTokens
            })
        }).then(function(response) {
            console.log(response);
        }).catch(function(error) {
            console.error(error);
        });

    }

};

module.exports = router;