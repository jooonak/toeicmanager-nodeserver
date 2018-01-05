/*
* natural이라는 api를 이용하여 중복단어를 제거한다.
* tokenizer.tokenize() 함수가 비동기 함수로 구현되어 있는데 callback 함수를 받지 않도록 설계가 되어 있어 api 코드를 수정하였다.
* 수정된 api 명은 'regexp_tokenizer.js'이며, 'RegexpTokenizer.prototype.tokenize' 함수 내부를 수정하였다.
* module의 경우 .gitignore리스트에 포함되어 있으므로 git pull을 받을 경우 직접 해당 부분을 수정해야한다.
* 수정 코드:
* RegexpTokenizer.prototype.tokenize = function(s, callback) {
    var results;

    if (this._gaps) {
        results = s.split(this._pattern);
        results = (this.discardEmpty) ? _.without(results,'',' ') : results;
    } else {
        results =  s.match(this._pattern);
    }
    callback(results);
};
* */
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
var callbackFunction;
module.exports.tokenizeText = function (text, callback) {
    callbackFunction = callback;
    return tokenizer.tokenize(text,test);
}

function test (tokens) {
    /*
   console.log("test callback:"+tokens);
   console.log(tokens.length);
   */
    var i;
    var result =[];
    obj = {};
    var token = "";
    for(i=0; i < tokens.length ; i++){
        token = tokens[i].toLowerCase();
        if((token.length <= 2) || !(isNaN(token)) ||
            token === 'i' || token ===  'my' || token ===  "me" || token ===  "mine" ||
            token ===  "you" || token ===  "your" || token ===  "yours" ||  token ===  "re" ||
            token ===  "he" || token ===  "his" || token ===  "him" ||
            token ===  "she" || token ===  "her" ||
            token ===  "an" || token ===  "the"||
            token ===  "or" || token ===  "and"
        ){
            console.log("check data: " + token);
            continue;
        }

        for (target in obj) {
            /*
            console.log("compare object:"+target);
            console.log("criteria:"+tokens[i]);
            */
            if(natural.JaroWinklerDistance(tokens[i],target) >= 0.9){
                tokens[i] = target;
                break;
            }
        }
        obj[tokens[i]]=0;
    }
    for (i in obj) {
        result.push(i);
    }
    console.log("result:" + result);
    callbackFunction(result);
};

