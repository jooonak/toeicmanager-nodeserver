var mysql = require("mysql");

//connecction pool 설정
var pool = mysql.createPool({
    connectionLimit : 10,
    host: "192.168.0.29",
    user: "java96",
    password: "java96",
    database : 'toeicmanager_db',
    debug : false
});

var getFrequentWords = function (mid, callback) {
    pool.getConnection(function(err,con){
        if(err){
            if(con){
                //연결을 해제하는 메서드이다.
                con.release();
            }
            callback(err, null);
            return;
        }

        console.log("db tread id: " + con.threadId);

        var selectSql =
            "select \n" +
            "word, meaning\n" +
            "from \n" +
            "tbl_exam_detail inner join\n" +
            "(select * from tbl_word) tbl_word\n" +
            "on tbl_exam_detail.wno = tbl_word.wno\n" +
            "where mid = ? \n" +
            "and ncnt >= 3 \n" +
            "and \n" +
            "result = 'x' \n" +
            "order by dno";
        con.query(selectSql, mid, function (err, result) {
            var text = "자주 틀리시는 단어는 <br>";
            console.log("result:" + JSON.stringify(result));
            console.log("result:" + result[0].word);
            for(var i = 0 ; i < result.length ; i ++){
                text = text + "<b>"+result[i].word +"</b> ("+result[i].meaning+")<br>"
            }
            text = text + "입니다. 항상 숙지해 주세요!";
            callback(null, text);
        });
    });

};

var getTodayWords = function (mid, callback) {
    pool.getConnection(function(err,con){
        if(err){
            if(con){
                con.release();
            }
            callback(err, null);
            return;
        }

        console.log("db tread id: " + con.threadId);

        var selectSql =
            "select \n" +
            "word, meaning, dno, tbl_word.wno\n" +
            "from \n" +
            "tbl_exam_detail inner join\n" +
            "(select * from tbl_word) tbl_word\n" +
            "on tbl_exam_detail.wno = tbl_word.wno\n" +
            "where mid = ? \n" +
            "and \n" +
            "result = 'x' \n" +
            "and\n" +
            "ncnt = 1\n" +
            "order by dno desc\n" +
            "limit 0, 5";
        con.query(selectSql, mid, function (err, result) {
            var text = "오늘 틀리신 단어는 <br>";
            console.log("result:" + JSON.stringify(result));
            console.log("result:" + result[0].word);
            for(var i = 0 ; i < result.length ; i ++){
                text = text + "<b>"+result[i].word +"</b> ("+result[i].meaning+")<br>"
            }
            text = text + "입니다. 내일은 꼭 맞추세요!";
            callback(null, text);
        });
    });
}

var getStudyState = function (mid, callback) {
    pool.getConnection(function(err,con){
        if(err){
            if(con){
                con.release();
            }
            callback(err, null);
            return;
        }

        console.log("db tread id: " + con.threadId);

        var selectSql =
            "select \n" +
            "sum(total) - sum(result) exam,\n" +
            "(\n" +
            "\tselect count(*) \n" +
            "\tfrom tbl_cycle \n" +
            "\twhere mid = ? \n" +
            "\tand \n" +
            "\tnextcycle <= date(now())\n" +
            ") cycle,\n" +
            "mid \n" +
            "from tbl_exam \n" +
            "where mid = ? group by mid;"
        con.query(selectSql, [mid, mid], function (err, result) {
            console.log("result:" + JSON.stringify(result));
            callback(null, {"state":result});
        });
    });
}

module.exports.getFrequentWords = getFrequentWords;

module.exports.getTodayWords = getTodayWords;

module.exports.getStudyState = getStudyState;