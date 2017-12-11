var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
var i;
//console.log(tokenizer.tokenize('If you\'re just looking to use natural without your own node application, you can install via NPM like so'));
var tokens;
var result =[];
tokens = tokenizer.tokenize('The new release, in a departure from the previous statements, includes a warning regarding initial coin offerings (ICOs) or token sales. It also highlights a "significant spurt" in the value of the overall cryptocurrency market.')

console.log(natural.JaroWinklerDistance("fire","firees"));
/*natural.LancasterStemmer.attach();
console.log("The new release, in a departure from the previous statements, includes a warning regarding initial coin offerings (ICOs) or token sales. It also highlights a \"significant spurt\" in the value of the overall cryptocurrency market.".tokenizeAndStem());*/
setTimeout(
    function test (){
        console.log(tokens.length);
        var token = "";
        for(i=0; i < tokens.length ; i++){
            console.log(tokens[i].length);
            console.log(tokens[i].toLowerCase());
            token = tokens[i].toLowerCase();
                if((tokens[i].length === 1) || token === 'i' || token ===  'my' || token ===  "me" || token ===  "mine" ||
                    token ===  "you" || token ===  "your" || token ===  "yours" ||  token ===  "re" ||
                    token ===  "he" || token ===  "his" || token ===  "him" ||
                    token ===  "she" || token ===  "her" ||
                    token ===  "an" || token ===  "the"){
                    continue;
                }
                result.push(tokens[i]);
        }
        console.log(find_duplicate_in_array(result));
    }, 200);



function find_duplicate_in_array(arra1) {
    var i,
        len=arra1.length,
        result = [],
        obj = {};
    for (i=0; i<len; i++)
    {
        obj[arra1[i]]=0;
    }
    for (i in obj) {
        result.push(i);
    }
    for(i = 0; i < arra1.length ; i++){
        console.log(arra1[i]);
    };

    return result;
}


