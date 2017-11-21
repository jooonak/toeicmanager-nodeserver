var express = require('express');
var router = express.Router();
var request = require('request');



/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log(req.param('words'));
    var resultdata = "";

    request(
        {
            url: 'https://glosbe.com/gapi/translate?from=eng&dest=kor&format=json&pretty=true&phrase='+req.param('words'),
            method: 'get',
            async: 'false'
        },
        function (err, response, body) {
            var bodyparse = JSON.parse(body);
            var resultdata = bodyparse.tuc[0].phrase.text;
            res.json(resultdata);
        }
    );

});

module.exports = router;
