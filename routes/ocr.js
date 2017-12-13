/*
* 동작 흐름: ocr에서 사진 데이터를 받은 후 google vision에 text 분석을 요청한다. 요청하여 나온 text 데이터는 naturaltest.js로 넘어가서 일종의 배열 형태로 변경하고, 변경된 배열을 front로 전달한다.(callback으로 전달)
*
* ※ 에러 발생 ※
* 현재 ocr을 호출할 경우 첫 번째 호출은 문제없이 동작하지만, 그 이후 호출은 'Can't set headers after they are sent.'라는 문제가 발생한다. 이 부분에 대해 체크를 해본결과
* node 서버와 google 서버 사이의 통신 문제는 아닌 것으로 확인되었으며 tokenizer 함수(외부 모듈)를 호출하는데 있어서 발생하는 문제도 아닌 것으로 확인되었다.
* 에러는 res.json()을 호출하는 지점 또는 express에서 발생하는 것으로 추정되나 정확한 원인을 더 분석해 볼 필요가 있다.
* */
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
