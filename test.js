'use strict';
var https = require('https');
var querystring = require('querystring');

var queryObject = {
    count : 3,
    q : "fravort",
    t : "images",
    safesearch : 1,
    locale : "it_IT"
}    

var qstr = querystring.stringify(queryObject);

let request_params = {
    hostname : "api.qwant.com",
    path : "/api/search/images?" + qstr,//?count=3&q=montagne&t=images&safesearch=1&locale=en_US",
    headers : {
        "Connection": "keep-alive",
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:55.0) Gecko/20100101 Firefox/55.0"
    }
};


https.get(request_params, function (response) {

    var body = '';

    response.on('error', function (err) {
        console.log("ERROR", err);
    });

    response.on('data', function (d) {
        body += d;
    });

    response.on('end', function () {
        var qwantObj = JSON.parse (body);
        console.log(JSON.stringify(qwantObj,null,2));
        //console.log("DONE", qwantObj.data.result.items);

//        var response = {
//            statusCode: 200,
//            headers: {
//              "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
//              "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
//            },
//            body: JSON.stringify(qwantObj.data.result.items)
//          };
//
//        callback(null, response);
    });
});