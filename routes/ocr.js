var express = require('express');
var router = express.Router();
var tokenizer = require("./logic/tokenizer.js");
var formidable = require('express-formidable');
// Imports the Google Cloud client library
const Vision = require('@google-cloud/vision');
const vision = new Vision();
router.use(formidable());

router.post('/', function(req, res) {
    const fileName = req.files.file.path;
    //const fileName = "data:image/jpeg;base64,"+req.fields.file.path;
    //Error: Can't set headers after they are sent.에 대한 내용은 아래 url을 따라 가보자
    //https://stackoverflow.com/questions/7042340/error-cant-set-headers-after-they-are-sent-to-the-client 
    // Read a local image as a text document

    vision.documentTextDetection({ source: { filename: fileName } })
            .then((results) => {

        const fullTextAnnotation = results[0].fullTextAnnotation;
        //console.log(fullTextAnnotation.text);
        var text =fullTextAnnotation.text;

        tokenizer.tokenizeText(text, function (result) {
            res.json(result);
        });
    }).catch((err) => {
            console.error('ERROR:', err);
        //res.json("recapture");
        res.send();
    });

});

module.exports = router;
