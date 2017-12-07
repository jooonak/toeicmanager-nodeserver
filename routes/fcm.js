var express = require('express');
var router = express.Router();
var firebase = require("firebase");
var admin = require("firebase-admin");
var fetch = require("node-fetch");

var serviceAccount = {
        "type": "service_account",
        "project_id": "fcmtest-670f6",
        "private_key_id": "0a2b9c15c68e49d7f6f513c24e03ed913db101dc",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCejx+H/8t2COaZ\nWrb5K7iNI5aI9phyXymA5ykMrJDBNkS1uVpvV2DWRHfynLmnjnphA5wzl+7zBXbP\nMLwSP3TbAUzPhR1G/ZbiC8ofScPpdRd12MHW3wEzRbA2Ad6aDaYEVQmTDJEIFXab\nq5kAOyZWvsM+bsBMoVollNV2YLRjVc7Ds3pvPblJrpcKL5JcXzMAsCWIiXhetqxJ\nw7eI2akrKRMci1iH+tFuG4EC99szSuJTve6DLa3Pox+R2viYXFn7zP6s9EeCbNv9\nVYOLkuJOypNX6r7jwGRL42mEoe/4mw9mi+AjU7Oc9fggWnENSqAVZpuv/4WOFfsc\nzY8eSoYxAgMBAAECggEAAyGb841daQQVe79TIDoZD659fVBzY8TV1r4Z7S5mQG6Q\nLk+OBedhmfGptcCbGQBDEfHmjo1IUoPP3BkgCbM3nVCaAfokwR9mcKnfcL098XkW\nwMTKVTI7vZW5fGOOkBfHaMv+H6mOnqx/1mSt5ZeFcw6a3/uDcC/6jgXxrkAMJ+8E\nq/MQtYW2R4nnPHcCbG5OK/ePaV9WFyoDriC1yjJYYqYaJtu+1THJGzQ9sDwBYf2t\nz8C3aSqN2hT/xrfFY7fb81SZDCF4sNFEP4iRPuekng15b+Q6Q560rCBy++0jX2/G\nznGvN6Gcs/QpC7hhgYSgsetKu/K6EnFAcdU3id8HAQKBgQDNzU24KD7pAMSmq9o1\nYFPn9ki4IFKIz7s3Ojl0GQK71Ppm4vBwm6SVSY6XOcjVi7B+7KlkooS7mli8CWzU\nav/D2emkZ0gQcCvj1lA7RTdfL67W6NVIILSrubTKyk+2HxYqH8YwFFsB4/kZ7pxy\n/zS2pw749/cXPWTKBsvplPTR8QKBgQDFO+BpZjauaWpatgIcwu8i1XJ6hkfBhV5J\nw6glr8zsDVh/O9nElCUfHjOg859ZIEwMx9jrakjpYRU1jSsEYh/g6XToGPd2jodf\nV/ZxE372jCBWP5RrXoVbvO6PnvOR54iBvY07431ZvSsnG0HUVvKcucFgtK2WlUOV\npkSgbPy4QQKBgG2Q7t6rdorAIPIHLj4akbE+GosEkkxKJAcMFYhsxFrR0ZozGgUp\np97e8W4rknO2UfnQ74InT/k8/B7n+avBZ3eSrWQcpG4z+fnroH1dpVQk47WA8gPb\nfbSrQshwGy3/sOIuVmpEfAsunvEiauKCYkMX/82m3kLeKamxIqCx8AFRAoGAfire\nVC4Jfqp6WUqisUlVdf/6ejxZvIaXGTKq5mi9+qZS3RkpJeHqmSxVtHkDjxzk6SwS\nLA3SVFBBI/+I7AXlBJfyq+IEsvdby3bWc+EXz5k1ulZzl/df8Z47MO5qOwRUQ0JB\nDXVpozUqXJrIEpAIJI+DD1ykynXzRNCWh9UQGMECgYAW+UEeSYGyCXzJQCHhwJaL\n2FZs4B34dIPVScYqSa/MHWj+43/ZNLVwil5zvweYYSomhlvq9z83DNWpEAz8l1Mj\nY9DLW0uB0tiXnMhmJu6sjz5MO0vhLTzuvDr7akM7P+VuiwHW4cFRy4r1wpPsnANB\nPpdgyuk+X7uvJmSOpClvrQ==\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-w865i@fcmtest-670f6.iam.gserviceaccount.com",
        "client_id": "111460466845055830086",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://accounts.google.com/o/oauth2/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-w865i%40fcmtest-670f6.iam.gserviceaccount.com"
    }
;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fcmtest-670f6.firebaseio.com/"
});

var key = 'AAAApAY6imo:APA91bH4XjOyE6g2vcDRb5v-h7ocuWn2xn4ksoxHCmQmyhLOKDAYZoErSrimkQtZRDgp23KhB3_vWSmgEBGC7HEVFjeIcfhIJV2M6JQ0IrvZrUh1hgfkjfRuY-kt5acuYRJBMaxASimV';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyABrFsxhwPZTuF7LyB7k6kaEA-7wXqrFY0",
    authDomain: "fcmtest-670f6.firebaseapp.com",
    databaseURL: "https://fcmtest-670f6.firebaseio.com",
    projectId: "fcmtest-670f6",
    storageBucket: "fcmtest-670f6.appspot.com",
    messagingSenderId: "704479136362"
};
firebase.initializeApp(config);


/* GET home page. */
router.get('/', function(req, res, next) {

    console.log("init........................")
    // These registration tokens come from the client FCM SDKs.
    var registrationTokens = req.query.token;

    console.log("body: " + req.query.token);
    // See the "Defining the message payload" section below for details
    // on how to define a message payload.
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

    // Send a message to the devices corresponding to the provided
    // registration tokens.
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
    })

    res.json({result : "success"});
});

module.exports = router;

// //이 함수는 데이터베이스에서 토큰을 받아온다 -> 로컬스토리지에서 가져오는 방식으로 변경필요
// firebase.database().ref('/tokens').once('value').then(function(snapshot) {

//     snapshot.forEach(function(child) {

//         var tokenObject = child.val();
//         console.log(tokenObject);

//         var registrationToken = tokenObject.token;

//         fetch('https://fcm.googleapis.com/fcm/send', {
//             'method': 'POST',
//             'headers': {
//                 'Authorization': 'key=' + key,
//                 'Content-Type': 'application/json'
//             },
//             'body': JSON.stringify({
//                 'notification': notification,
//                 'to': registrationToken
//             })
//         }).then(function(response) {
//             console.log(response);
//         }).catch(function(error) {
//             console.error(error);
//         })

//     });
// });

