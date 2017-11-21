var express = require('express');

var router = express.Router();
var formidable = require('express-formidable');
router.use(formidable());
// Imports the Google Cloud client library
const Vision = require('@google-cloud/vision');

// Creates a client
const vision = new Vision();



router.post('/', function(req, res, next) {
    //res.render('result', { title: 'result' });

    //console.log(req.fields); // contains non-file fields
    //console.log(req.files); // contains files

    const fileName = req.files.file.path;

    // Read a local image as a text document
        vision.documentTextDetection({ source: { filename: fileName } })
            .then((results) => {
            const fullTextAnnotation = results[0].fullTextAnnotation;
        console.log(fullTextAnnotation.text);
        var text = fullTextAnnotation.text;

    })
    .catch((err) => {
            console.error('ERROR:', err);
    });

});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('result', { text: text });
});




module.exports = router;
