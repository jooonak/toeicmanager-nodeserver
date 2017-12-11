var express = require('express');
var router = express.Router();
var firebase = require("firebase");
var admin = require("firebase-admin");
var fetch = require("node-fetch");
var mysql = require("mysql");
var schedule = require('node-schedule');

var rule = new schedule.RecurrenceRule();
// rule.dayOfWeek = [0, new schedule.range(0, 6)];
// rule.hour = 2;
// rule.minute = 0;

var key = 'AAAApAY6imo:APA91bH4XjOyE6g2vcDRb5v-h7ocuWn2xn4ksoxHCmQmyhLOKDAYZoErSrimkQtZRDgp23KhB3_vWSmgEBGC7HEVFjeIcfhIJV2M6JQ0IrvZrUh1hgfkjfRuY-kt5acuYRJBMaxASimV';

var payload = {
    notification : {
        title: 'test firebase',
        body: '이거 좀 재미없음..',
        sound : "default",
        click_action : "FCM_PLUGIN_ACTIVITY",
        icon: 'firebase-logo.png',
        // 'click_action': 'http://localhost:8081'
    }
};

// schedule.scheduleJob(rule, function () {
//     sendNotification();
// });

schedule.scheduleJob('*/1 * * * * *', function () {
    sendNotification();
});

function sendNotification() {

    var con = mysql.createConnection({
        host: "192.168.0.18",
        user: "java96",
        password: "java96",
        database : 'toeicmanager_db'
    });

    console.log("init........................");

    var sql = "select * from tbl_member";

    con.query(sql, function (err, result) {
        if (err) throw err;

        console.log("result: ", result);
        // for (var i = 0; i < result.length; i++) {

            var now = new Date().getHours() * 3600 + new Date().getMinutes() * 60 + new Date().getSeconds();

            setTimeout(function () {pushNotification(result[0].pushtoken)}, 1000);

            // setTimeout(pushNotification(result[i].token), result[i].pusham - now);
            // setTimeout(pushNotification(result[i].token), result[i].pushpm - now);
        // }
    });

    function pushNotification(registrationTokens) {
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