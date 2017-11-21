var express = require('express');
var router = express.Router();
var formidable = require('express-formidable');
router.use(formidable());
// Imports the Google Cloud client library
const Vision = require('@google-cloud/vision');

// Creates a client
const vision = new Vision();


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('ocr', { title: 'ocr' });
});


router.post('/', function(req, res, next) {
    //console.log(req.fields); // contains non-file fields
    //console.log(req.files); // contains files

    const fileName = req.files.file.path;

    //Error: Can't set headers after they are sent.에 대한 내용은 아래 url을 따라 가보자
    //https://stackoverflow.com/questions/7042340/error-cant-set-headers-after-they-are-sent-to-the-client 
    // Read a local image as a text document
    vision.documentTextDetection({ source: { filename: fileName } })
        .then((results) => {
        const fullTextAnnotation = results[0].fullTextAnnotation;
    //console.log(fullTextAnnotation.text);
    //var text =fullTextAnnotation.text;
    //res.json(text);
    res.json(fullTextAnnotation.text);
    }).catch((err) => {
            console.error('ERROR:', err);
    });

});




module.exports = router;
