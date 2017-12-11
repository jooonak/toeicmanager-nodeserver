var express = require('express');
var router = express.Router();
var formidable = require('express-formidable');
router.use(formidable());
// Imports the Google Cloud client library
const Vision = require('@google-cloud/vision');
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
// Creates a clientthdn
const vision = new Vision();


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('ocr', { title: 'ocr' });
});


router.post('/', function(req, res, next) {
    //console.log(req.fields); // contains non-file fields
    //console.log(req.files); // contains files
    //console.log(req.fields.file);
    //console.log(req.files.file.path);
    const fileName = req.files.file.path;
    console.log(fileName);
    //console.log("1111111111"+fileName);

    //const fileName = "data:image/jpeg;base64,"+req.fields.file.path;

    //Error: Can't set headers after they are sent.에 대한 내용은 아래 url을 따라 가보자
    //https://stackoverflow.com/questions/7042340/error-cant-set-headers-after-they-are-sent-to-the-client 
    // Read a local image as a text document

    vision.documentTextDetection({ source: { filename: fileName } })
        .then((results) => {
        console.log(results);
        const fullTextAnnotation = results[0].fullTextAnnotation;

        console.log(fullTextAnnotation.text);
        var text =fullTextAnnotation.text;
        console.log(tokenizer.tokenize(text));
        res.json(text);
        //res.json(fullTextAnnotation.text);
    }).catch((err) => {
            console.error('ERROR:', err);
            res.json("recapture");
    });





//label(사진 특징) code

// The name of the image file to annotate

// Prepare the request object
/*const request = {
    source: {filename: fileName}
};*/

//set GOOGLE_APPLICATION_CREDENTIALS=C:\Users\bit303\WebstormProjects\untitled\new project.json


// Performs label detection on the image file

/*vision.labelDetection(request)
.then((results) => {
const labels = results[0].labelAnnotations;
    var text = "";

console.log('Labels:');
labels.forEach((label) => text += label.description);
console.log(text);
res.json(text);
})
.catch((err) => {
console.error('ERROR:', err);
});*/



});




module.exports = router;
