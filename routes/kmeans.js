var mysql = require("mysql");
var kmeans = require('kmeans-node');

var con = mysql.createConnection({
    host: "192.168.0.29",
    user: "java96",
    password: "java96",
    database : 'toeicmanager_db'
});

con.connect(function (err) {
    if(err) throw  err;
    console.log("Connected!");

    var selectSql = "select * from tbl_timecheck order by mid , timecheck asc ";
    var object =[];
    var resultArr = [];

    // tbl_timecheck 에서 데이터를 가져옴
    con.query(selectSql, function (err, result) {
        if (err) throw err

        //console.log(result);
        var midArr = [];   //mid의 배열
        var timeArr = [];   //time의 배열
        var converedTime = [];   //second로 변환된 시간 배열
        var value = []  // 각각의 mid 중복 개수


        //mid, time 배열 생성 및 time을 second로 변환
        for (var i = 0; i < result.length; i++) {
            midArr.push(result[i].mid);
            timeArr.push(result[i].timecheck);

            var test = (timeArr[i]).split(":");
            converedTime.push(test[0] * 3600 + test[1] * 60 + parseInt(test[2]));
        }

        //mid 배열의 중복값 개수 체크
        var stat = 1;
        var num = 0;
        for (var i = 0; i < midArr.length; i++) {
            if (midArr[i] === midArr[i + 1]) {
                stat += 1;
                value[num] = stat;
            } else if (i + 1 === midArr.length) {
            } else if (midArr[i] !== midArr[i + 1]) {
                stat = 1;
                num += 1;
            }
        }

        // mid중복값 제거
        var uniqMid = midArr.reduce(function (a, b) {
            if (a.indexOf(b) < 0) a.push(b);
            return a;
        }, []);

        //kmeans 알고리즘 사용 및 최종 데이터(resultArr)로 변환
        var number = 0;
        for (var i = 0; i < value.length; i++) {

            if (i === 0) {
                object = kmeans.array(converedTime.slice(0, value[i]), 2);
                resultArr.push({mid: uniqMid[i], value: {v1: secondsToTime(object[0].value), v2: secondsToTime(object[1].value)}});
                console.log(object);

            } else {
                number += value[i - 1];
                object = kmeans.array(converedTime.slice(number, number + value[i]), 2);
                resultArr.push({mid: uniqMid[i], value: {v1: secondsToTime(object[0].value), v2: secondsToTime(object[1].value)}});
                console.log(object);
            }
        }

        // 최종 데이터를 이용한 업데이트 쿼리
       for(var i=0; i < resultArr.length; i++){
             var updateSql = "update tbl_member set pusham = '"+resultArr[i].value.v1+"' , pushpm = '"+resultArr[i].value.v2+"' where mid = '"+resultArr[i].mid+"' ";

             con.query(updateSql, function (err, result) {
                 if(err) throw err;
             })
        }

    })
});


// seconds를 hh:mm:ss 으로 변경
function secondsToTime(secs){
    var hours = Math.floor(secs / (60 * 60));
    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);
    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);
    return hours + ":" + minutes + ":" + seconds;
}
