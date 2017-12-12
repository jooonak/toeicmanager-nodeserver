var express = require('express');
var router = express.Router();
var request = require('request');
var uuid = require('uuid-v4');
var mapper = require("./mapper.js");


var story_id = "59fbe0fb65d44027b9456104";
var url = 'http://mindmap.ai:8000/v1/' + story_id + '/';

router.post('/', function(req, res, next) {
    console.log(req.param("text"));
    var inputtxtinit = req.param("text");
    var mid = req.param("mid");
    console.log("inputtest:" +inputtxtinit);

    var inputJsonObjectDataInit = {
        "story_id": story_id,
        "context": {
            "conversation_id": uuid(), //각각의 유저와의 대화로 따로 구별하기 위해서 uuid-v4를 이용하여 만든다. 로그관리에 필요하다.
            "information": {
                "conversation_stack": [
                    {
                        "conversation_node": 'root',
                        "conversation_node_name": '루트노드'
                    }
                ],
                "conversation_counter": 1,
                "user_request_counter": 1,
            },
            "visit_counter": 0,
            "reprompt": false,
            "retrieve_field": false,
            "message": null,
            "keyboard": null,
            "random": false,
            "input_field": false,
            "variables": null
        },
        "input": {
            "text": inputtxtinit
        }
    };

    var json = '';
    request({
            url: url,
            method: 'POST',
            json: inputJsonObjectDataInit
        },
        // response 받기
        function(error, response, body){
            console.log("--------- response된 payload json 시작 ----------");
            console.log(body);
            console.log("--------- response된 payload json 끝 ----------");
            json = body;
            var data;
            var text;
            if(json === "<h1>Server Error (500)</h1>"){
                res.json("다시 말씀해 주시겠습니까?");
                return;
            }

            // 받은 텍스트보기
            var outputTextArray = json["output"]["text"][0];
            console.log("test: "+json["entities"].length);

            if(outputTextArray === 'tip'){
                //팁 intent에 대한 처리, 팁 영상에 대한 url 정보를 data에 담아서 보내야 한다.
                data = {"tip":{"text":json["context"]["message"]["text"],"media":json["context"]["message"]["message_button"]["url"],"img":json["context"]["message"]["photo"]["url"]}};

            }else if(outputTextArray === 'db'){
                //DB 접근이 필요한 intent에 대한 처리(단어 검색, 현황)
                if(json["intents"]["selected"]["intent"] === '단어 검색' && json["entities"][0]["value"] === '자주') {
                    //자주 틀린 단어에 대하여 검색하는 쿼리문
                    //callback 함수를 설정하고 callback 함수에 res.json(text)라는 구문을 넣음으로써 callback 함수가 해당 컨넥션을 최종적으로
                    //처리하도록 하였다.
                    mapper.getFrequentWords(mid, function (err, text) {
                        res.json(text);
                    });
                    return;
                }else if(json["intents"]["selected"]["intent"] === '단어 검색' && json["entities"][0]["value"] === '오늘'){
                    //오늘 틀린 단어에 대하여 검색하는 쿼리문
                    mapper.getTodayWords(mid, function (err, text) {
                        res.json(text);
                    });
                    return;
                }else if(json["intents"]["selected"]["intent"] === '현황') {
                    //학습 현황에 대해 검색하는 쿼리문
                    mapper.getStudyState(mid, function (err, text) {
                        console.log(text);
                        res.json(text);
                    });
                    return;
                }
            }else {
                data = json["output"]["text"][0];
            }
            res.json(data);
        });
});

module.exports = router;