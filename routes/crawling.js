var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var request = require('request');

/* GET home page. */
router.get('/sentences', function(req, res, next) {

    var word = 'kind'//req.query.word;

    function getSentences(word, callback) {
        var url = 'https://en.oxforddictionaries.com/definition/' + word; //word
        request(url, function (err, response, html) {
            if (err) {console.log(err)};

            var $ = cheerio.load(html);
            var text = $('.ex').text();
            var sentences = [];
            for (var i = 0; i < 5; i++ ){
                sentences.push(text.substring(2, text.length -1).split('’ ‘')[i]);
            }
            return callback(sentences);
        });
    }
    getSentences(word, function (result) {
        res.json({sentences : result});
    })
});

router.get('/img', function(req, res, next) {

    var word = 'kind'//req.query.word;

    function getImgsSrc(word, callback) {
        var url = 'https://www.google.co.kr/search?q=' + word + '&source=lnms&tbm=isch&sa=X&ved=0ahUKEwj33Y7qofnXAhVCl5QKHUimBFEQ_AUICygC&biw=1121&bih=949';
        request(url, function( err, response, html ){
            if (err) {console.log(err)};

            var $ = cheerio.load(html);
            var imgs = [];

            $('img').each(function (index, item) {
                if ($(this).attr('src').startsWith('https://') || $(this).attr('src').startsWith('data:image')) {
                    imgs.push($(this).attr('src'));
                }
                if (index === 3) return false;
            });
            return callback(imgs);
        });
    }

    getImgsSrc(word, function (result) {
        res.json({imgs : result});
    });
});

module.exports = router;
